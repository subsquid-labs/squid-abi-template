import {OutDir, Output} from '@subsquid/util-internal-code-printer'

import {SquidFragment} from './interfaces'

export class ProcessorCodegen {
    private outDir: OutDir
    constructor(
        private options: {
            address: string
            archive: string
            typegenFileName: string
            events: SquidFragment[]
            functions: SquidFragment[]
            from?: number
        }
    ) {
        this.outDir = new OutDir(`./src`)
    }

    generate() {
        this.generateProcessor()
        this.outDir.add(`util.ts`, [__dirname, './support/util.ts'])
    }

    private generateProcessor() {
        let out = this.outDir.file(`processor.ts`)
        out.line(`import * as abi from './abi/${this.options.typegenFileName}'`)
        this.importModels(out)
        out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)
        out.line(
            `import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} ` +
                `from '@subsquid/evm-processor'`
        )
        out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
        out.line(`import {normalize} from './util'`)
        out.line()
        out.line(`const processor = new EvmBatchProcessor()`)
        out.indentation(() => {
            out.line(`.setDataSource({`)
            out.indentation(() => {
                out.line(`archive: '${this.options.archive}',`)
            })
            out.line(`})`)

            if (this.options.from != null) {
                out.line(`.setBlockRange({`)
                out.indentation(() => {
                    out.line(`from: ${this.options.from}`)
                })
                out.line(`})`)
            }

            if (this.hasEvents()) {
                this.printEvmLogSubscribe(out, this.options.address, this.options.events)
            }
            if (this.hasFunctions()) {
                this.printTransactionSubscribe(out, this.options.address, this.options.functions)
            }
        })
        out.line()
        this.printEntityUnionType(out)
        out.line()
        out.line(`processor.run(new TypeormDatabase(), async (ctx) => {`)
        out.indentation(() => {
            if (this.hasEvents()) {
                out.line(`let events: Record<string, SquidEventEntity[]> = {}`)
            }
            if (this.hasFunctions()) {
                out.line(`let functions: Record<string, SquidFunctionEntity[]> = {}`)
            }
            out.line(`let transactions: Transaction[] = []`)
            out.line(`let blocks: Block[] = []`)

            out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                out.line(`let b = new Block({`)
                out.indentation(() => {
                    out.line(`id: block.id,`)
                    out.line(`number: block.height,`)
                    out.line(`timestamp: new Date(block.timestamp),`)
                })
                out.line(`})`)
                out.line(`let blockTransactions = new Map<string, Transaction>()`)
                out.block(`for (let item of items)`, () => {
                    out.line(`if (item.address !== '${this.options.address}') continue`)
                    if (this.hasEvents() || this.hasFunctions()) {
                        out.line(`let it: SquidEntity | undefined`)
                        out.block(`switch (item.kind)`, () => {
                            if (this.hasEvents()) {
                                out.line(`case 'evmLog':`)
                                out.indentation(() => {
                                    out.line(`it = parseEvmLog(ctx, item)`)
                                    out.block(`if (it)`, () => {
                                        out.line(`if (events[it.name] == null) events[it.name] = []`)
                                        out.line(`events[it.name].push(it)`)
                                    })
                                    out.line(`break`)
                                })
                            }
                            if (this.hasFunctions()) {
                                out.line(`case 'transaction':`)
                                out.indentation(() => {
                                    out.line(`it = parseTransaction(ctx, item)`)
                                    out.block(`if (it)`, () => {
                                        out.line(`if (functions[it.name] == null) functions[it.name] = []`)
                                        out.line(`functions[it.name].push(it)`)
                                    })
                                    out.line(`break`)
                                })
                            }
                            out.line(`default:`)
                            out.indentation(() => out.line(`continue`))
                        })
                        out.block(`if (it)`, () => {
                            out.line(`let t = blockTransactions.get(item.transaction.id)`)
                            out.block(`if (!t)`, () => {
                                out.line(`t = new Transaction({`)
                                out.indentation(() => {
                                    out.line(`id: item.transaction.id,`)
                                    out.line(`hash: item.transaction.hash,`)
                                    out.line(`contract: item.transaction.to,`)
                                    out.line(`block: b,`)
                                })
                                out.line(`})`)
                                out.line(`blockTransactions.set(t.id, t)`)
                            })
                            out.line(`it.transaction = t`)
                            out.line(`it.block = b`)
                        })
                    }
                })
                out.block(`if (blockTransactions.size > 0)`, () => {
                    out.line(`blocks.push(b)`)
                    out.line(`transactions.push(...blockTransactions.values())`)
                })
            })
            out.line(`await ctx.store.save(blocks)`)
            out.line(`await ctx.store.save(transactions)`)
            if (this.hasFunctions()) {
                out.block(`for (let f in functions)`, () => {
                    out.line(`await ctx.store.save(functions[f])`)
                })
            }
            if (this.hasEvents()) {
                out.block(`for (let e in events)`, () => {
                    out.line(`await ctx.store.save(events[e])`)
                })
            }
        })
        out.line(`})`)
        out.line()
        out.line(`type Item = BatchProcessorItem<typeof processor>`)
        out.line(`type Context = BatchHandlerContext<Store, Item>`)
        if (this.hasEvents()) {
            out.line()
            this.printEventsParser(out, this.options.events)
        }
        if (this.hasFunctions()) {
            out.line()
            this.printFunctionsParser(out, this.options.functions)
        }

        return out.write()
    }

    private printEvmLogSubscribe(out: Output, address: string, events: SquidFragment[]) {
        out.line(`.addLog('${address}', {`)
        out.indentation(() => {
            out.line(`filter: [`)
            out.indentation(() => {
                out.line(`[`)
                out.indentation(() => {
                    for (let e of events) {
                        out.line(`abi.events['${e.name}'].topic,`)
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
                out.line(`transaction: {`)
                out.indentation(() => {
                    out.line(`hash: true,`)
                })
                out.line(`},`)
            })
            out.line(`} as const,`)
        })
        out.line(`})`)
    }

    private printTransactionSubscribe(out: Output, address: string, functions: SquidFragment[]) {
        out.line(`.addTransaction('${address}', {`)
        out.indentation(() => {
            out.line(`sighash: [`)
            out.indentation(() => {
                for (let t of functions) {
                    out.line(`abi.functions['${t.name}'].sighash,`)
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

    private printEventsParser(out: Output, events: SquidFragment[]) {
        if (Object.keys(events).length == 0) return

        out.line(
            `function parseEvmLog(ctx: Context, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {`
        )
        out.indentation(() => {
            out.line(`switch (item.evmLog.topics[0]) {`)
            out.indentation(() => {
                for (let e of events) {
                    out.block(`case abi.events['${e.name}'].topic:`, () => {
                        out.line(`let e = normalize(abi.events['${e.name}'].decode(item.evmLog))`)
                        out.line(`return new ${e.entityName}({`)
                        out.indentation(() => {
                            out.line(`id: item.evmLog.id,`)
                            out.line(`name: '${e.name}',`)
                            for (let i = 0; i < e.params.length; i++) {
                                out.line(
                                    `${e.params[i].name}: ${
                                        e.params[i].schemaType === 'JSON' ? `toJSON(e[${i}])` : `e[${i}]`
                                    },`
                                )
                            }
                        })
                        out.line(`})`)
                    })
                }
            })
            out.line(`}`)
        })
        out.line(`}`)
    }

    private printFunctionsParser(out: Output, functions: SquidFragment[]) {
        if (Object.keys(functions).length == 0) return

        out.line(
            `function parseTransaction(ctx: Context, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {`
        )
        out.indentation(() => {
            out.line(`switch (item.transaction.input.slice(0, 10)) {`)
            out.indentation(() => {
                for (let f of functions) {
                    out.block(`case abi.functions['${f.name}'].sighash:`, () => {
                        out.line(`let f = normalize(abi.functions['${f.name}'].decode(item.transaction.input))`)
                        out.line(`return new ${f.entityName}({`)
                        out.indentation(() => {
                            out.line(`id: item.transaction.id,`)
                            out.line(`name: '${f.name}',`)
                            for (let i = 0; i < f.params.length; i++) {
                                out.line(`${f.params[i].name}: ${
                                    f.params[i].schemaType === 'JSON' ? `toJSON(f[${i}])` : `f[${i}]`
                                },`)
                            }
                        })
                        out.line(`})`)
                    })
                }
            })
            out.line(`}`)
        })
        out.line(`}`)
    }

    private importModels(out: Output) {
        let eventModels = Object.values(this.options.events).map((f) => f.entityName)
        let functionModels = Object.values(this.options.functions).map((f) => f.entityName)
        out.line(`import {${[`Transaction`, `Block`, ...eventModels, ...functionModels].join(`, `)}} from './model'`)
    }

    private printEntityUnionType(out: Output) {
        let models: string[] = []
        if (this.hasEvents()) {
            let eventModels = Object.values(this.options.events).map((f) => f.entityName)
            out.line(`type SquidEventEntity = ${eventModels.join(` | `)}`)
            models.push(`SquidEventEntity`)
        }
        if (this.hasFunctions()) {
            let functionModels = Object.values(this.options.functions).map((f) => f.entityName)
            out.line(`type SquidFunctionEntity = ${functionModels.join(` | `)}`)
            models.push(`SquidFunctionEntity`)
        }
        if (models.length > 0) {
            out.line(`type SquidEntity = ${models.join(` | `)}`)
        }
    }

    private hasEvents() {
        return this.options.events.length > 0
    }

    private hasFunctions() {
        return this.options.functions.length > 0
    }
}
