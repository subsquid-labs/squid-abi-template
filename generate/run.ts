import {runProgram} from '@subsquid/util-internal'
import {FileOutput} from '@subsquid/util-internal-code-printer'
import assert from 'assert'
import {execSync} from 'child_process'
import {program} from 'commander'
import {register, create} from 'ts-node'

runProgram(async function () {
    program
        .requiredOption(`--address <contract>`)
        .requiredOption(`--archive <url>`)
        .option(`--abi <path>`)
        .option(`--event <name...>`)
        .option(`--function <name...>`)
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

    let abiName = opts.abi || opts.address
    execSync(
        [
            `npx squid-evm-typegen ./src/abi`,
            ` ${abiName}`,
            opts.etherscanApi ? ` --etherscan-api ${opts.etherscanApi}` : ``,
            ` --clean`,
        ].join(``),
        {stdio: `inherit`}
    )

    let abi = require(`../src/abi/${abiName}.ts`)
    let events = opts.event
        ? opts.event.includes('*')
            ? Object.keys(abi.events)
            : opts.event.map((e) => {
                  assert(abi.events[e] != null)
                  return e
              })
        : undefined
    let functions = opts.function
        ? opts.function.includes('*')
            ? Object.keys(abi.functions)
            : opts.function.map((f) => {
                  assert(abi.functions[f] != null)
                  return f
              })
        : undefined
    assert(events || functions)

    let out = new FileOutput(`./src/processor.ts`)

    out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)
    out.line(
        `import {EvmBatchProcessor, EvmBlock, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} from '@subsquid/evm-processor'`
    )
    out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
    out.line(`import {EvmEvent, EvmTransaction} from './model'`)
    out.line(`import * as abi from './abi/${abiName}'`)
    out.line()
    out.line(`const processor = new EvmBatchProcessor()`)
    out.indentation(() => {
        out.line(`.setDataSource({`)
        out.indentation(() => {
            out.line(`archive: '${opts.archive}',`)
        })
        out.line(`})`)

        if (opts.from != null) {
            let from = parseInt(opts.from)
            assert(Number.isSafeInteger(from))
            assert(from >= 0)
            out.line(`.setBlockRange({`)
            out.indentation(() => {
                out.line(`from: ${opts.from}`)
            })
            out.line(`})`)
        }

        if (events) {
            out.line(`.addLog('${opts.address.toLowerCase()}', {`)
            out.indentation(() => {
                out.line(`filter: [`)
                out.indentation(() => {
                    out.line(`[`)
                    out.indentation(() => {
                        for (let e of events || []) {
                            out.line(`abi.events['${e}'].topic,`)
                        }
                    })
                    out.line(`],`)
                })
                out.line(`],`)
                out.line(`data: {`)
                out.indentation(() => {
                    out.line(`evmLog: {`)
                    out.indentation(() => {
                        out.line(`topics: true,`)
                        out.line(`data: true,`)
                    })
                    out.line(`},`)
                })
                out.line(`} as const,`)
            })
            out.line(`})`)
        }

        if (functions) {
            out.line(`.addTransaction('${opts.address.toLowerCase()}', {`)
            out.indentation(() => {
                out.line(`sighash: [`)
                out.indentation(() => {
                    for (let t of functions || []) {
                        out.line(`abi.functions['${t}'].sighash,`)
                    }
                })
                out.line(`],`)
                out.line(`data: {`)
                out.indentation(() => {
                    out.line(`transaction: {`)
                    out.indentation(() => {
                        out.line(`hash: true,`)
                        out.line(`input: true,`)
                    })
                    out.line(`},`)
                })
                out.line(`} as const,`)
            })
            out.line(`})`)
        }
    })
    out.line()
    out.line(`processor.run(new TypeormDatabase(), async (ctx) => {`)
    out.indentation(() => {
        if (events) out.line(`let events: EvmEvent[] = []`)
        if (functions) out.line(`let transactions: EvmTransaction[] = []`)

        out.line(`for (let block of ctx.blocks) {`)
        out.indentation(() => {
            out.line(`for (let item of block.items) {`)
            out.indentation(() => {
                out.line(`switch (item.kind) {`)
                out.indentation(() => {
                    if (opts.event) {
                        out.line(`case 'evmLog': {`)
                        out.indentation(() => {
                            out.line(`let e = parseEvmLog(ctx, block.header, item)`)
                            out.line(`if (e) events.push(e)`)
                            out.line(`break`)
                        })
                        out.line(`}`)
                    }
                    if (functions) {
                        out.line(`case 'transaction': {`)
                        out.indentation(() => {
                            out.line(`let t = parseTransaction(ctx, block.header, item)`)
                            out.line(`if (t) transactions.push(t)`)
                            out.line(`break`)
                        })
                        out.line(`}`)
                    }
                })
                out.line(`}`)
            })
            out.line(`}`)
        })
        out.line(`}`)
        if (events) out.line(`await ctx.store.save(events)`)
        if (functions) out.line(`await ctx.store.save(transactions)`)
    })
    out.line(`})`)
    out.line()
    out.line(`type Item = BatchProcessorItem<typeof processor>`)
    out.line(`type Context = BatchHandlerContext<Store, Item>`)
    out.line()
    if (events) {
        out.line(`function parseEvmLog(ctx: Context, block: EvmBlock, item: BatchProcessorLogItem<typeof processor>) {`)
        out.indentation(() => {
            out.line(`switch (item.evmLog.topics[0]) {`)
            out.indentation(() => {
                for (let e of events || []) {
                    out.line(`case abi.events['${e}'].topic:`)
                    out.indentation(() => {
                        out.line(`return new EvmEvent({`)
                        out.indentation(() => {
                            out.line(`id: item.evmLog.id,`)
                            out.line(`block: block.height,`)
                            out.line(`name: '${e}',`)
                            out.line(`params: toJSON(abi.events['${e}'].decode(item.evmLog)),`)
                        })
                        out.line(`})`)
                    })
                }
            })
            out.line(`}`)
        })
        out.line(`}`)
    }
    out.line()
    if (functions) {
        out.line(
            `function parseTransaction(ctx: Context, block: EvmBlock, item: BatchProcessorTransactionItem<typeof processor>) {`
        )
        out.indentation(() => {
            out.line(`switch (item.transaction.input.slice(0, 10)) {`)
            out.indentation(() => {
                for (let t of functions || []) {
                    out.line(`case abi.functions['${t}'].sighash:`)
                    out.indentation(() => {
                        out.line(`return new EvmTransaction({`)
                        out.indentation(() => {
                            out.line(`id: item.transaction.id,`)
                            out.line(`block: block.height,`)
                            out.line(`name: '${t}',`)
                            out.line(`hash: item.transaction.hash,`)
                            out.line(`params: toJSON(abi.functions['${t}'].decode(item.transaction.input)),`)
                        })
                        out.line(`})`)
                    })
                }
            })
            out.line(`}`)
        })
        out.line(`}`)
    }

    out.write()
})
