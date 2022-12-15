import {runProgram} from '@subsquid/util-internal'
import {FileOutput} from '@subsquid/util-internal-code-printer'
import {execSync} from 'child_process'
import {program} from 'commander'
import assert from 'assert'
import path from 'path'

class Codegen {
    private out: FileOutput

    constructor(
        private options: {
            address: string
            abi: string
            archive: string
            events?: string[]
            functions?: string[]
            from?: number
        }
    ) {
        this.out = new FileOutput(`./src/processor.ts`)
    }

    generate() {
        this.out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)
        this.out.line(
            `import {EvmBatchProcessor, EvmBlock, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} from '@subsquid/evm-processor'`
        )
        this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
        this.out.line(`import {EvmEvent, EvmFunction, Transaction, Block} from './model'`)
        this.out.line(`import * as abi from './abi/${this.options.abi}'`)
        this.out.line()
        this.out.line(`const processor = new EvmBatchProcessor()`)
        this.out.indentation(() => {
            this.out.line(`.setDataSource({`)
            this.out.indentation(() => {
                this.out.line(`archive: '${this.options.archive}',`)
            })
            this.out.line(`})`)

            if (this.options.from != null) {
                this.out.line(`.setBlockRange({`)
                this.out.indentation(() => {
                    this.out.line(`from: ${this.options.from}`)
                })
                this.out.line(`})`)
            }

            if (this.options.events) this.printEvmLogSubscribe(this.options.address, this.options.events)
            if (this.options.functions) this.printTransactionSubscribe(this.options.address, this.options.functions)
        })
        this.out.line()
        this.out.line(`processor.run(new TypeormDatabase(), async (ctx) => {`)
        this.out.indentation(() => {
            this.out.line(`let events: EvmEvent[] = []`)
            this.out.line(`let functions: EvmFunction[] = []`)
            this.out.line(`let transactions: Transaction[] = []`)
            this.out.line(`let blocks: Block[] = []`)

            this.out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                this.out.line(`let b = new Block({`)
                this.out.indentation(() => {
                    this.out.line(`id: block.id,`)
                    this.out.line(`number: block.height,`)
                    this.out.line(`timestamp: new Date(block.timestamp),`)
                })
                this.out.line(`})`)
                this.out.line(`let blockTransactions = new Map<string, Transaction>()`)
                this.out.block(`for (let item of items)`, () => {
                    this.out.line(`if (item.address !== '${this.options.address}') continue`)
                    this.out.line(`let it: EvmEvent | EvmFunction | undefined`)
                    this.out.block(`switch (item.kind)`, () => {
                        if (this.options.events) {
                            this.out.line(`case 'evmLog':`)
                            this.out.indentation(() => {
                                this.out.line(`it = parseEvmLog(ctx, item)`)
                                this.out.line(`if (it) events.push(it)`)
                                this.out.line(`break`)
                            })
                        }
                        if (this.options.functions) {
                            this.out.line(`case 'transaction':`)
                            this.out.indentation(() => {
                                this.out.line(`it = parseTransaction(ctx, item)`)
                                this.out.line(`if (it) functions.push(it)`)
                                this.out.line(`break`)
                            })
                        }
                        this.out.line(`default:`)
                        this.out.indentation(() => this.out.line(`continue`))
                    })
                    this.out.block(`if (it)`, () => {
                        this.out.line(`let t = blockTransactions.get(item.transaction.id)`)
                        this.out.block(`if (!t)`, () => {
                            this.out.line(`t = new Transaction({`)
                            this.out.indentation(() => {
                                this.out.line(`id: item.transaction.id,`)
                                this.out.line(`hash: item.transaction.hash,`)
                                this.out.line(`contract: item.transaction.to,`)
                                this.out.line(`block: b,`)
                            })
                            this.out.line(`})`)
                            this.out.line(`blockTransactions.set(t.id, t)`)
                        })
                        this.out.line(`it.transaction = t`)
                        this.out.line(`it.block = b`)
                    })
                })
                this.out.block(`if (blockTransactions.size > 0)`, () => {
                    this.out.line(`blocks.push(b)`)
                    this.out.line(`transactions.push(...blockTransactions.values())`)
                })
            })
            this.out.line(`await ctx.store.save(blocks)`)
            this.out.line(`await ctx.store.save(transactions)`)
            this.out.line(`await ctx.store.save(functions)`)
            this.out.line(`await ctx.store.save(events)`)
        })
        this.out.line(`})`)
        this.out.line()
        this.out.line(`type Item = BatchProcessorItem<typeof processor>`)
        this.out.line(`type Context = BatchHandlerContext<Store, Item>`)
        if (this.options.events) {
            this.out.line()
            this.printEventsParser(this.options.events)
        }
        if (this.options.functions) {
            this.out.line()
            this.printFunctionsParser(this.options.functions)
        }
        this.out.line()

        this.out.write()
    }

    private printEvmLogSubscribe(address: string, events: string[]) {
        this.out.line(`.addLog('${address}', {`)
        this.out.indentation(() => {
            this.out.line(`filter: [`)
            this.out.indentation(() => {
                this.out.line(`[`)
                this.out.indentation(() => {
                    for (let e of events) {
                        this.out.line(`abi.events['${e}'].topic,`)
                    }
                })
                this.out.line(`],`)
            })
            this.out.line(`],`)
            this.out.line(`data: {`)
            this.out.indentation(() => {
                this.out.line(`evmLog: {`)
                this.out.indentation(() => {
                    this.out.line(`topics: true,`)
                    this.out.line(`data: true,`)
                })
                this.out.line(`},`)
                this.out.line(`transaction: {`)
                this.out.indentation(() => {
                    this.out.line(`hash: true,`)
                })
                this.out.line(`},`)
            })
            this.out.line(`} as const,`)
        })
        this.out.line(`})`)
    }

    private printTransactionSubscribe(address: string, functions: string[]) {
        this.out.line(`.addTransaction('${address}', {`)
        this.out.indentation(() => {
            this.out.line(`sighash: [`)
            this.out.indentation(() => {
                for (let t of functions) {
                    this.out.line(`abi.functions['${t}'].sighash,`)
                }
            })
            this.out.line(`],`)
            this.out.line(`data: {`)
            this.out.indentation(() => {
                this.out.line(`transaction: {`)
                this.out.indentation(() => {
                    this.out.line(`hash: true,`)
                    this.out.line(`input: true,`)
                })
                this.out.line(`},`)
            })
            this.out.line(`} as const,`)
        })
        this.out.line(`})`)
    }

    private printEventsParser(events: string[]) {
        this.out.line(
            `function parseEvmLog(ctx: Context, item: BatchProcessorLogItem<typeof processor>): EvmEvent | undefined {`
        )
        this.out.indentation(() => {
            this.out.line(`switch (item.evmLog.topics[0]) {`)
            this.out.indentation(() => {
                for (let e of events || []) {
                    this.out.line(`case abi.events['${e}'].topic:`)
                    this.out.indentation(() => {
                        this.out.line(`return new EvmEvent({`)
                        this.out.indentation(() => {
                            this.out.line(`id: item.evmLog.id,`)
                            this.out.line(`name: '${e}',`)
                            this.out.line(`params: toJSON(abi.events['${e}'].decode(item.evmLog)),`)
                        })
                        this.out.line(`})`)
                    })
                }
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }

    private printFunctionsParser(functions: string[]) {
        this.out.line(
            `function parseTransaction(ctx: Context, item: BatchProcessorTransactionItem<typeof processor>): EvmFunction | undefined  {`
        )
        this.out.indentation(() => {
            this.out.line(`switch (item.transaction.input.slice(0, 10)) {`)
            this.out.indentation(() => {
                for (let t of functions || []) {
                    this.out.line(`case abi.functions['${t}'].sighash:`)
                    this.out.indentation(() => {
                        this.out.line(`return new EvmFunction({`)
                        this.out.indentation(() => {
                            this.out.line(`id: item.transaction.id,`)
                            this.out.line(`name: '${t}',`)
                            this.out.line(`params: toJSON(abi.functions['${t}'].decode(item.transaction.input)),`)
                        })
                        this.out.line(`})`)
                    })
                }
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }
}

runProgram(async function () {
    program
        .requiredOption(`--address <contract>`)
        .requiredOption(`--archive <url>`)
        .option(`--abi <path>`)
        .option(`-e, --event <name...>`)
        .option(`-f, --function <name...>`)
        .option(`--from <block>`)
        .option(`--etherscan-api <url>`, `etherscan API to fetch contract ABI by a known address`)

    program.parse()

    let opts = program.opts() as {
        address: string
        archive: string
        abi: string
        event?: string[]
        function?: string[]
        from?: string
        etherscanApi?: string
    }

    execSync(
        [
            `npx squid-evm-typegen ./src/abi`,
            ` ${opts.abi || opts.address}`,
            opts.etherscanApi ? ` --etherscan-api ${opts.etherscanApi}` : ``,
            ` --clean`,
        ].join(``),
        {stdio: `inherit`}
    )

    let abiName = opts.abi ? path.basename(opts.abi, `.json`) : opts.address
    let abi = require(`../src/abi/${abiName}.ts`)
    let events = opts.event
        ? opts.event.includes('*')
            ? Object.keys(abi.events)
            : opts.event.map((e) => {
                  assert(abi.events[e] != null, `event ${e} does not exist`)
                  return e
              })
        : undefined
    let functions = opts.function
        ? opts.function.includes('*')
            ? Object.keys(abi.functions)
            : opts.function.map((f) => {
                  assert(abi.functions[f] != null, `function ${f} does not exist`)
                  return f
              })
        : undefined
    assert(events || functions)

    let from = opts.from ? parseInt(opts.from) : 0
    if (from != null) {
        assert(Number.isSafeInteger(from))
        assert(from >= 0)
    }

    new Codegen({
        address: opts.address.toLowerCase(),
        abi: abiName,
        events,
        functions,
        archive: opts.archive,
        from,
    }).generate()
})
