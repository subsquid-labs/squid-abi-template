import * as abi from './abi/0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'
import {Transaction, Block, NewGravatarEvent, UpdatedGravatarEvent, CreateGravatarFunction} from './model'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} from '@subsquid/evm-processor'
import {normalize} from './util'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://eth.archive.subsquid.io',
    })
    .setBlockRange({
        from: 6000000
    })
    .addLog('0x2e645469f354bb4f5c8a05b3b30a929361cf77ec', {
        filter: [
            [
                abi.events['NewGravatar'].topic,
                abi.events['UpdatedGravatar'].topic,
            ],
        ],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
            transaction: {
                hash: true,
            },
        } as const,
    })
    .addTransaction('0x2e645469f354bb4f5c8a05b3b30a929361cf77ec', {
        sighash: [
            abi.functions['createGravatar'].sighash,
        ],
        data: {
            transaction: {
                hash: true,
                input: true,
            },
        } as const,
    })

type SquidEventEntity = NewGravatarEvent | UpdatedGravatarEvent
type SquidFunctionEntity = CreateGravatarFunction
type SquidEntity = SquidEventEntity | SquidFunctionEntity

processor.run(new TypeormDatabase(), async (ctx) => {
    let events: Record<string, SquidEventEntity[]> = {}
    let functions: Record<string, SquidFunctionEntity[]> = {}
    let transactions: Transaction[] = []
    let blocks: Block[] = []
    for (let {header: block, items} of ctx.blocks) {
        let b = new Block({
            id: block.id,
            number: block.height,
            timestamp: new Date(block.timestamp),
        })
        let blockTransactions = new Map<string, Transaction>()
        for (let item of items) {
            if (item.address !== '0x2e645469f354bb4f5c8a05b3b30a929361cf77ec') continue
            let it: SquidEntity | undefined
            switch (item.kind) {
                case 'evmLog':
                    it = parseEvmLog(ctx, item)
                    if (it) {
                        if (events[it.name] == null) events[it.name] = []
                        events[it.name].push(it)
                    }
                    break
                case 'transaction':
                    it = parseTransaction(ctx, item)
                    if (it) {
                        if (functions[it.name] == null) functions[it.name] = []
                        functions[it.name].push(it)
                    }
                    break
                default:
                    continue
            }
            if (it) {
                let t = blockTransactions.get(item.transaction.id)
                if (!t) {
                    t = new Transaction({
                        id: item.transaction.id,
                        hash: item.transaction.hash,
                        contract: item.transaction.to,
                        block: b,
                    })
                    blockTransactions.set(t.id, t)
                }
                it.transaction = t
                it.block = b
            }
        }
        if (blockTransactions.size > 0) {
            blocks.push(b)
            transactions.push(...blockTransactions.values())
        }
    }
    await ctx.store.save(blocks)
    await ctx.store.save(transactions)
    for (let f in functions) {
        await ctx.store.save(functions[f])
    }
    for (let e in events) {
        await ctx.store.save(events[e])
    }
})

type Item = BatchProcessorItem<typeof processor>
type Context = BatchHandlerContext<Store, Item>

function parseEvmLog(ctx: Context, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {
    switch (item.evmLog.topics[0]) {
        case abi.events['NewGravatar'].topic: {
            let e = normalize(abi.events['NewGravatar'].decode(item.evmLog))
            return new NewGravatarEvent({
                id: item.evmLog.id,
                name: 'NewGravatar',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
                arg3: e[3],
            })
        }
        case abi.events['UpdatedGravatar'].topic: {
            let e = normalize(abi.events['UpdatedGravatar'].decode(item.evmLog))
            return new UpdatedGravatarEvent({
                id: item.evmLog.id,
                name: 'UpdatedGravatar',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
                arg3: e[3],
            })
        }
    }
}

function parseTransaction(ctx: Context, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {
    switch (item.transaction.input.slice(0, 10)) {
        case abi.functions['createGravatar'].sighash: {
            let f = normalize(abi.functions['createGravatar'].decode(item.transaction.input))
            return new CreateGravatarFunction({
                id: item.transaction.id,
                name: 'createGravatar',
                arg0: f[0],
                arg1: f[1],
            })
        }
    }
}
