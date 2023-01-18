import * as abi from './abi/abi'
import {Transaction, Block, ApprovalEvent, ApprovalForAllEvent, ContractUriEvent, LockEvent, RoleAdminChangedEvent, RoleGrantedEvent, RoleRevokedEvent, SecondarySaleFeeEvent, TransferEvent, UriEvent, UriAllEvent, CompositeCreatorRoleFunction, DefaultAdminRoleFunction, GovernanceRoleFunction, MinterRoleFunction, OperatorRoleFunction, VersionFunction, ApproveFunction, BalanceOfFunction, BatchFunction, BurnFunction, CompositeUriFunction, ContractUriFunction, DecimalsFunction, DefaultTokenUriFunction, Erc2665HandlerFunction, ExistsFunction, GetApprovedFunction, GetRoleAdminFunction, GetRoleMemberFunction, GetRoleMemberCountFunction, GetTransferFee0Function, GetTransferFee1Function, GlobalCompositeTokenUriBaseFunction, GrantRoleFunction, HasRoleFunction, InitializeFunction, InitializedFunction, IsApprovedForAllFunction, IsProxyFunction, LockFunction, LockedForeverFunction, MintFunction, MintDefaultFunction, NameFunction, OriginalUriFunction, OwnerOfFunction, ProxyRegistryFunction, RenounceRoleFunction, RevokeRoleFunction, RoyaltyInfoFunction, SafeTransferFrom0Function, SafeTransferFrom1Function, SecondarySaleFeeFunction, SetApprovalForAllFunction, SetContractUriFunction, SetCustomCompositeTokenUriBaseFunction, SetCustomTokenUriFunction, SetDefaultTokenUriFunction, SetErc2665HandlerFunction, SetFeeFunction, SetGlobalCompositeTokenUriBaseFunction, SetProxyRegistryAddressFunction, SetTransferListenerFunction, SetUseCompositeTokenUriFunction, SupportsInterfaceFunction, SymbolFunction, TokenUriFunction, TotalSupplyFunction, TransferFromFunction, TransferListenerFunction, UriFunction} from './model'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} from '@subsquid/evm-processor'
import {normalize} from './util'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://eth.archive.subsquid.io',
    })
    .setBlockRange({
        from: 10000000
    })
    .addLog('0xac5c7493036de60e63eb81c5e9a440b42f47ebf5', {
        filter: [
            [
                abi.events['Approval'].topic,
                abi.events['ApprovalForAll'].topic,
                abi.events['ContractURI'].topic,
                abi.events['Lock'].topic,
                abi.events['RoleAdminChanged'].topic,
                abi.events['RoleGranted'].topic,
                abi.events['RoleRevoked'].topic,
                abi.events['SecondarySaleFee'].topic,
                abi.events['Transfer'].topic,
                abi.events['URI'].topic,
                abi.events['URIAll'].topic,
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
    .addTransaction('0xac5c7493036de60e63eb81c5e9a440b42f47ebf5', {
        sighash: [
            abi.functions['COMPOSITE_CREATOR_ROLE'].sighash,
            abi.functions['DEFAULT_ADMIN_ROLE'].sighash,
            abi.functions['GOVERNANCE_ROLE'].sighash,
            abi.functions['MINTER_ROLE'].sighash,
            abi.functions['OPERATOR_ROLE'].sighash,
            abi.functions['VERSION'].sighash,
            abi.functions['approve'].sighash,
            abi.functions['balanceOf'].sighash,
            abi.functions['batch'].sighash,
            abi.functions['burn'].sighash,
            abi.functions['compositeURI'].sighash,
            abi.functions['contractURI'].sighash,
            abi.functions['decimals'].sighash,
            abi.functions['defaultTokenURI'].sighash,
            abi.functions['erc2665Handler'].sighash,
            abi.functions['exists'].sighash,
            abi.functions['getApproved'].sighash,
            abi.functions['getRoleAdmin'].sighash,
            abi.functions['getRoleMember'].sighash,
            abi.functions['getRoleMemberCount'].sighash,
            abi.functions['getTransferFee(uint256)'].sighash,
            abi.functions['getTransferFee(uint256,string)'].sighash,
            abi.functions['globalCompositeTokenURIBase'].sighash,
            abi.functions['grantRole'].sighash,
            abi.functions['hasRole'].sighash,
            abi.functions['initialize'].sighash,
            abi.functions['initialized'].sighash,
            abi.functions['isApprovedForAll'].sighash,
            abi.functions['isProxy'].sighash,
            abi.functions['lock'].sighash,
            abi.functions['lockedForever'].sighash,
            abi.functions['mint'].sighash,
            abi.functions['mintDefault'].sighash,
            abi.functions['name'].sighash,
            abi.functions['originalURI'].sighash,
            abi.functions['ownerOf'].sighash,
            abi.functions['proxyRegistry'].sighash,
            abi.functions['renounceRole'].sighash,
            abi.functions['revokeRole'].sighash,
            abi.functions['royaltyInfo'].sighash,
            abi.functions['safeTransferFrom(address,address,uint256)'].sighash,
            abi.functions['safeTransferFrom(address,address,uint256,bytes)'].sighash,
            abi.functions['secondarySaleFee'].sighash,
            abi.functions['setApprovalForAll'].sighash,
            abi.functions['setContractURI'].sighash,
            abi.functions['setCustomCompositeTokenURIBase'].sighash,
            abi.functions['setCustomTokenURI'].sighash,
            abi.functions['setDefaultTokenURI'].sighash,
            abi.functions['setERC2665Handler'].sighash,
            abi.functions['setFee'].sighash,
            abi.functions['setGlobalCompositeTokenURIBase'].sighash,
            abi.functions['setProxyRegistryAddress'].sighash,
            abi.functions['setTransferListener'].sighash,
            abi.functions['setUseCompositeTokenURI'].sighash,
            abi.functions['supportsInterface'].sighash,
            abi.functions['symbol'].sighash,
            abi.functions['tokenURI'].sighash,
            abi.functions['totalSupply'].sighash,
            abi.functions['transferFrom'].sighash,
            abi.functions['transferListener'].sighash,
            abi.functions['uri'].sighash,
        ],
        data: {
            transaction: {
                hash: true,
                input: true,
            },
        } as const,
    })

type SquidEventEntity = ApprovalEvent | ApprovalForAllEvent | ContractUriEvent | LockEvent | RoleAdminChangedEvent | RoleGrantedEvent | RoleRevokedEvent | SecondarySaleFeeEvent | TransferEvent | UriEvent | UriAllEvent
type SquidFunctionEntity = CompositeCreatorRoleFunction | DefaultAdminRoleFunction | GovernanceRoleFunction | MinterRoleFunction | OperatorRoleFunction | VersionFunction | ApproveFunction | BalanceOfFunction | BatchFunction | BurnFunction | CompositeUriFunction | ContractUriFunction | DecimalsFunction | DefaultTokenUriFunction | Erc2665HandlerFunction | ExistsFunction | GetApprovedFunction | GetRoleAdminFunction | GetRoleMemberFunction | GetRoleMemberCountFunction | GetTransferFee0Function | GetTransferFee1Function | GlobalCompositeTokenUriBaseFunction | GrantRoleFunction | HasRoleFunction | InitializeFunction | InitializedFunction | IsApprovedForAllFunction | IsProxyFunction | LockFunction | LockedForeverFunction | MintFunction | MintDefaultFunction | NameFunction | OriginalUriFunction | OwnerOfFunction | ProxyRegistryFunction | RenounceRoleFunction | RevokeRoleFunction | RoyaltyInfoFunction | SafeTransferFrom0Function | SafeTransferFrom1Function | SecondarySaleFeeFunction | SetApprovalForAllFunction | SetContractUriFunction | SetCustomCompositeTokenUriBaseFunction | SetCustomTokenUriFunction | SetDefaultTokenUriFunction | SetErc2665HandlerFunction | SetFeeFunction | SetGlobalCompositeTokenUriBaseFunction | SetProxyRegistryAddressFunction | SetTransferListenerFunction | SetUseCompositeTokenUriFunction | SupportsInterfaceFunction | SymbolFunction | TokenUriFunction | TotalSupplyFunction | TransferFromFunction | TransferListenerFunction | UriFunction
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
            if (item.address !== '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5') continue
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
        case abi.events['Approval'].topic: {
            let e = normalize(abi.events['Approval'].decode(item.evmLog))
            return new ApprovalEvent({
                id: item.evmLog.id,
                name: 'Approval',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['ApprovalForAll'].topic: {
            let e = normalize(abi.events['ApprovalForAll'].decode(item.evmLog))
            return new ApprovalForAllEvent({
                id: item.evmLog.id,
                name: 'ApprovalForAll',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['ContractURI'].topic: {
            let e = normalize(abi.events['ContractURI'].decode(item.evmLog))
            return new ContractUriEvent({
                id: item.evmLog.id,
                name: 'ContractURI',
            })
        }
        case abi.events['Lock'].topic: {
            let e = normalize(abi.events['Lock'].decode(item.evmLog))
            return new LockEvent({
                id: item.evmLog.id,
                name: 'Lock',
                arg0: e[0],
            })
        }
        case abi.events['RoleAdminChanged'].topic: {
            let e = normalize(abi.events['RoleAdminChanged'].decode(item.evmLog))
            return new RoleAdminChangedEvent({
                id: item.evmLog.id,
                name: 'RoleAdminChanged',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['RoleGranted'].topic: {
            let e = normalize(abi.events['RoleGranted'].decode(item.evmLog))
            return new RoleGrantedEvent({
                id: item.evmLog.id,
                name: 'RoleGranted',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['RoleRevoked'].topic: {
            let e = normalize(abi.events['RoleRevoked'].decode(item.evmLog))
            return new RoleRevokedEvent({
                id: item.evmLog.id,
                name: 'RoleRevoked',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['SecondarySaleFee'].topic: {
            let e = normalize(abi.events['SecondarySaleFee'].decode(item.evmLog))
            return new SecondarySaleFeeEvent({
                id: item.evmLog.id,
                name: 'SecondarySaleFee',
                arg0: e[0],
                arg1: e[1],
            })
        }
        case abi.events['Transfer'].topic: {
            let e = normalize(abi.events['Transfer'].decode(item.evmLog))
            return new TransferEvent({
                id: item.evmLog.id,
                name: 'Transfer',
                arg0: e[0],
                arg1: e[1],
                arg2: e[2],
            })
        }
        case abi.events['URI'].topic: {
            let e = normalize(abi.events['URI'].decode(item.evmLog))
            return new UriEvent({
                id: item.evmLog.id,
                name: 'URI',
                arg0: e[0],
            })
        }
        case abi.events['URIAll'].topic: {
            let e = normalize(abi.events['URIAll'].decode(item.evmLog))
            return new UriAllEvent({
                id: item.evmLog.id,
                name: 'URIAll',
            })
        }
    }
}

function parseTransaction(ctx: Context, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {
    switch (item.transaction.input.slice(0, 10)) {
        case abi.functions['COMPOSITE_CREATOR_ROLE'].sighash: {
            let f = normalize(abi.functions['COMPOSITE_CREATOR_ROLE'].decode(item.transaction.input))
            return new CompositeCreatorRoleFunction({
                id: item.transaction.id,
                name: 'COMPOSITE_CREATOR_ROLE',
            })
        }
        case abi.functions['DEFAULT_ADMIN_ROLE'].sighash: {
            let f = normalize(abi.functions['DEFAULT_ADMIN_ROLE'].decode(item.transaction.input))
            return new DefaultAdminRoleFunction({
                id: item.transaction.id,
                name: 'DEFAULT_ADMIN_ROLE',
            })
        }
        case abi.functions['GOVERNANCE_ROLE'].sighash: {
            let f = normalize(abi.functions['GOVERNANCE_ROLE'].decode(item.transaction.input))
            return new GovernanceRoleFunction({
                id: item.transaction.id,
                name: 'GOVERNANCE_ROLE',
            })
        }
        case abi.functions['MINTER_ROLE'].sighash: {
            let f = normalize(abi.functions['MINTER_ROLE'].decode(item.transaction.input))
            return new MinterRoleFunction({
                id: item.transaction.id,
                name: 'MINTER_ROLE',
            })
        }
        case abi.functions['OPERATOR_ROLE'].sighash: {
            let f = normalize(abi.functions['OPERATOR_ROLE'].decode(item.transaction.input))
            return new OperatorRoleFunction({
                id: item.transaction.id,
                name: 'OPERATOR_ROLE',
            })
        }
        case abi.functions['VERSION'].sighash: {
            let f = normalize(abi.functions['VERSION'].decode(item.transaction.input))
            return new VersionFunction({
                id: item.transaction.id,
                name: 'VERSION',
            })
        }
        case abi.functions['approve'].sighash: {
            let f = normalize(abi.functions['approve'].decode(item.transaction.input))
            return new ApproveFunction({
                id: item.transaction.id,
                name: 'approve',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['balanceOf'].sighash: {
            let f = normalize(abi.functions['balanceOf'].decode(item.transaction.input))
            return new BalanceOfFunction({
                id: item.transaction.id,
                name: 'balanceOf',
                arg0: f[0],
            })
        }
        case abi.functions['batch'].sighash: {
            let f = normalize(abi.functions['batch'].decode(item.transaction.input))
            return new BatchFunction({
                id: item.transaction.id,
                name: 'batch',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['burn'].sighash: {
            let f = normalize(abi.functions['burn'].decode(item.transaction.input))
            return new BurnFunction({
                id: item.transaction.id,
                name: 'burn',
                arg0: f[0],
            })
        }
        case abi.functions['compositeURI'].sighash: {
            let f = normalize(abi.functions['compositeURI'].decode(item.transaction.input))
            return new CompositeUriFunction({
                id: item.transaction.id,
                name: 'compositeURI',
                arg0: f[0],
            })
        }
        case abi.functions['contractURI'].sighash: {
            let f = normalize(abi.functions['contractURI'].decode(item.transaction.input))
            return new ContractUriFunction({
                id: item.transaction.id,
                name: 'contractURI',
            })
        }
        case abi.functions['decimals'].sighash: {
            let f = normalize(abi.functions['decimals'].decode(item.transaction.input))
            return new DecimalsFunction({
                id: item.transaction.id,
                name: 'decimals',
            })
        }
        case abi.functions['defaultTokenURI'].sighash: {
            let f = normalize(abi.functions['defaultTokenURI'].decode(item.transaction.input))
            return new DefaultTokenUriFunction({
                id: item.transaction.id,
                name: 'defaultTokenURI',
            })
        }
        case abi.functions['erc2665Handler'].sighash: {
            let f = normalize(abi.functions['erc2665Handler'].decode(item.transaction.input))
            return new Erc2665HandlerFunction({
                id: item.transaction.id,
                name: 'erc2665Handler',
            })
        }
        case abi.functions['exists'].sighash: {
            let f = normalize(abi.functions['exists'].decode(item.transaction.input))
            return new ExistsFunction({
                id: item.transaction.id,
                name: 'exists',
                arg0: f[0],
            })
        }
        case abi.functions['getApproved'].sighash: {
            let f = normalize(abi.functions['getApproved'].decode(item.transaction.input))
            return new GetApprovedFunction({
                id: item.transaction.id,
                name: 'getApproved',
                arg0: f[0],
            })
        }
        case abi.functions['getRoleAdmin'].sighash: {
            let f = normalize(abi.functions['getRoleAdmin'].decode(item.transaction.input))
            return new GetRoleAdminFunction({
                id: item.transaction.id,
                name: 'getRoleAdmin',
                arg0: f[0],
            })
        }
        case abi.functions['getRoleMember'].sighash: {
            let f = normalize(abi.functions['getRoleMember'].decode(item.transaction.input))
            return new GetRoleMemberFunction({
                id: item.transaction.id,
                name: 'getRoleMember',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['getRoleMemberCount'].sighash: {
            let f = normalize(abi.functions['getRoleMemberCount'].decode(item.transaction.input))
            return new GetRoleMemberCountFunction({
                id: item.transaction.id,
                name: 'getRoleMemberCount',
                arg0: f[0],
            })
        }
        case abi.functions['getTransferFee(uint256)'].sighash: {
            let f = normalize(abi.functions['getTransferFee(uint256)'].decode(item.transaction.input))
            return new GetTransferFee0Function({
                id: item.transaction.id,
                name: 'getTransferFee(uint256)',
                arg0: f[0],
            })
        }
        case abi.functions['getTransferFee(uint256,string)'].sighash: {
            let f = normalize(abi.functions['getTransferFee(uint256,string)'].decode(item.transaction.input))
            return new GetTransferFee1Function({
                id: item.transaction.id,
                name: 'getTransferFee(uint256,string)',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['globalCompositeTokenURIBase'].sighash: {
            let f = normalize(abi.functions['globalCompositeTokenURIBase'].decode(item.transaction.input))
            return new GlobalCompositeTokenUriBaseFunction({
                id: item.transaction.id,
                name: 'globalCompositeTokenURIBase',
            })
        }
        case abi.functions['grantRole'].sighash: {
            let f = normalize(abi.functions['grantRole'].decode(item.transaction.input))
            return new GrantRoleFunction({
                id: item.transaction.id,
                name: 'grantRole',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['hasRole'].sighash: {
            let f = normalize(abi.functions['hasRole'].decode(item.transaction.input))
            return new HasRoleFunction({
                id: item.transaction.id,
                name: 'hasRole',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['initialize'].sighash: {
            let f = normalize(abi.functions['initialize'].decode(item.transaction.input))
            return new InitializeFunction({
                id: item.transaction.id,
                name: 'initialize',
                arg0: f[0],
                arg1: f[1],
                arg2: f[2],
                arg3: f[3],
                arg4: f[4],
                arg5: f[5],
                arg6: f[6],
                arg7: f[7],
                arg8: f[8],
            })
        }
        case abi.functions['initialized'].sighash: {
            let f = normalize(abi.functions['initialized'].decode(item.transaction.input))
            return new InitializedFunction({
                id: item.transaction.id,
                name: 'initialized',
            })
        }
        case abi.functions['isApprovedForAll'].sighash: {
            let f = normalize(abi.functions['isApprovedForAll'].decode(item.transaction.input))
            return new IsApprovedForAllFunction({
                id: item.transaction.id,
                name: 'isApprovedForAll',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['isProxy'].sighash: {
            let f = normalize(abi.functions['isProxy'].decode(item.transaction.input))
            return new IsProxyFunction({
                id: item.transaction.id,
                name: 'isProxy',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['lock'].sighash: {
            let f = normalize(abi.functions['lock'].decode(item.transaction.input))
            return new LockFunction({
                id: item.transaction.id,
                name: 'lock',
            })
        }
        case abi.functions['lockedForever'].sighash: {
            let f = normalize(abi.functions['lockedForever'].decode(item.transaction.input))
            return new LockedForeverFunction({
                id: item.transaction.id,
                name: 'lockedForever',
            })
        }
        case abi.functions['mint'].sighash: {
            let f = normalize(abi.functions['mint'].decode(item.transaction.input))
            return new MintFunction({
                id: item.transaction.id,
                name: 'mint',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['mintDefault'].sighash: {
            let f = normalize(abi.functions['mintDefault'].decode(item.transaction.input))
            return new MintDefaultFunction({
                id: item.transaction.id,
                name: 'mintDefault',
                arg0: f[0],
            })
        }
        case abi.functions['name'].sighash: {
            let f = normalize(abi.functions['name'].decode(item.transaction.input))
            return new NameFunction({
                id: item.transaction.id,
                name: 'name',
            })
        }
        case abi.functions['originalURI'].sighash: {
            let f = normalize(abi.functions['originalURI'].decode(item.transaction.input))
            return new OriginalUriFunction({
                id: item.transaction.id,
                name: 'originalURI',
                arg0: f[0],
            })
        }
        case abi.functions['ownerOf'].sighash: {
            let f = normalize(abi.functions['ownerOf'].decode(item.transaction.input))
            return new OwnerOfFunction({
                id: item.transaction.id,
                name: 'ownerOf',
                arg0: f[0],
            })
        }
        case abi.functions['proxyRegistry'].sighash: {
            let f = normalize(abi.functions['proxyRegistry'].decode(item.transaction.input))
            return new ProxyRegistryFunction({
                id: item.transaction.id,
                name: 'proxyRegistry',
            })
        }
        case abi.functions['renounceRole'].sighash: {
            let f = normalize(abi.functions['renounceRole'].decode(item.transaction.input))
            return new RenounceRoleFunction({
                id: item.transaction.id,
                name: 'renounceRole',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['revokeRole'].sighash: {
            let f = normalize(abi.functions['revokeRole'].decode(item.transaction.input))
            return new RevokeRoleFunction({
                id: item.transaction.id,
                name: 'revokeRole',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['royaltyInfo'].sighash: {
            let f = normalize(abi.functions['royaltyInfo'].decode(item.transaction.input))
            return new RoyaltyInfoFunction({
                id: item.transaction.id,
                name: 'royaltyInfo',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['safeTransferFrom(address,address,uint256)'].sighash: {
            let f = normalize(abi.functions['safeTransferFrom(address,address,uint256)'].decode(item.transaction.input))
            return new SafeTransferFrom0Function({
                id: item.transaction.id,
                name: 'safeTransferFrom(address,address,uint256)',
                arg0: f[0],
                arg1: f[1],
                arg2: f[2],
            })
        }
        case abi.functions['safeTransferFrom(address,address,uint256,bytes)'].sighash: {
            let f = normalize(abi.functions['safeTransferFrom(address,address,uint256,bytes)'].decode(item.transaction.input))
            return new SafeTransferFrom1Function({
                id: item.transaction.id,
                name: 'safeTransferFrom(address,address,uint256,bytes)',
                arg0: f[0],
                arg1: f[1],
                arg2: f[2],
                arg3: f[3],
            })
        }
        case abi.functions['secondarySaleFee'].sighash: {
            let f = normalize(abi.functions['secondarySaleFee'].decode(item.transaction.input))
            return new SecondarySaleFeeFunction({
                id: item.transaction.id,
                name: 'secondarySaleFee',
                arg0: f[0],
            })
        }
        case abi.functions['setApprovalForAll'].sighash: {
            let f = normalize(abi.functions['setApprovalForAll'].decode(item.transaction.input))
            return new SetApprovalForAllFunction({
                id: item.transaction.id,
                name: 'setApprovalForAll',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['setContractURI'].sighash: {
            let f = normalize(abi.functions['setContractURI'].decode(item.transaction.input))
            return new SetContractUriFunction({
                id: item.transaction.id,
                name: 'setContractURI',
                arg0: f[0],
            })
        }
        case abi.functions['setCustomCompositeTokenURIBase'].sighash: {
            let f = normalize(abi.functions['setCustomCompositeTokenURIBase'].decode(item.transaction.input))
            return new SetCustomCompositeTokenUriBaseFunction({
                id: item.transaction.id,
                name: 'setCustomCompositeTokenURIBase',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['setCustomTokenURI'].sighash: {
            let f = normalize(abi.functions['setCustomTokenURI'].decode(item.transaction.input))
            return new SetCustomTokenUriFunction({
                id: item.transaction.id,
                name: 'setCustomTokenURI',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['setDefaultTokenURI'].sighash: {
            let f = normalize(abi.functions['setDefaultTokenURI'].decode(item.transaction.input))
            return new SetDefaultTokenUriFunction({
                id: item.transaction.id,
                name: 'setDefaultTokenURI',
                arg0: f[0],
            })
        }
        case abi.functions['setERC2665Handler'].sighash: {
            let f = normalize(abi.functions['setERC2665Handler'].decode(item.transaction.input))
            return new SetErc2665HandlerFunction({
                id: item.transaction.id,
                name: 'setERC2665Handler',
                arg0: f[0],
            })
        }
        case abi.functions['setFee'].sighash: {
            let f = normalize(abi.functions['setFee'].decode(item.transaction.input))
            return new SetFeeFunction({
                id: item.transaction.id,
                name: 'setFee',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['setGlobalCompositeTokenURIBase'].sighash: {
            let f = normalize(abi.functions['setGlobalCompositeTokenURIBase'].decode(item.transaction.input))
            return new SetGlobalCompositeTokenUriBaseFunction({
                id: item.transaction.id,
                name: 'setGlobalCompositeTokenURIBase',
                arg0: f[0],
            })
        }
        case abi.functions['setProxyRegistryAddress'].sighash: {
            let f = normalize(abi.functions['setProxyRegistryAddress'].decode(item.transaction.input))
            return new SetProxyRegistryAddressFunction({
                id: item.transaction.id,
                name: 'setProxyRegistryAddress',
                arg0: f[0],
            })
        }
        case abi.functions['setTransferListener'].sighash: {
            let f = normalize(abi.functions['setTransferListener'].decode(item.transaction.input))
            return new SetTransferListenerFunction({
                id: item.transaction.id,
                name: 'setTransferListener',
                arg0: f[0],
            })
        }
        case abi.functions['setUseCompositeTokenURI'].sighash: {
            let f = normalize(abi.functions['setUseCompositeTokenURI'].decode(item.transaction.input))
            return new SetUseCompositeTokenUriFunction({
                id: item.transaction.id,
                name: 'setUseCompositeTokenURI',
                arg0: f[0],
                arg1: f[1],
            })
        }
        case abi.functions['supportsInterface'].sighash: {
            let f = normalize(abi.functions['supportsInterface'].decode(item.transaction.input))
            return new SupportsInterfaceFunction({
                id: item.transaction.id,
                name: 'supportsInterface',
                arg0: f[0],
            })
        }
        case abi.functions['symbol'].sighash: {
            let f = normalize(abi.functions['symbol'].decode(item.transaction.input))
            return new SymbolFunction({
                id: item.transaction.id,
                name: 'symbol',
            })
        }
        case abi.functions['tokenURI'].sighash: {
            let f = normalize(abi.functions['tokenURI'].decode(item.transaction.input))
            return new TokenUriFunction({
                id: item.transaction.id,
                name: 'tokenURI',
                arg0: f[0],
            })
        }
        case abi.functions['totalSupply'].sighash: {
            let f = normalize(abi.functions['totalSupply'].decode(item.transaction.input))
            return new TotalSupplyFunction({
                id: item.transaction.id,
                name: 'totalSupply',
            })
        }
        case abi.functions['transferFrom'].sighash: {
            let f = normalize(abi.functions['transferFrom'].decode(item.transaction.input))
            return new TransferFromFunction({
                id: item.transaction.id,
                name: 'transferFrom',
                arg0: f[0],
                arg1: f[1],
                arg2: f[2],
            })
        }
        case abi.functions['transferListener'].sighash: {
            let f = normalize(abi.functions['transferListener'].decode(item.transaction.input))
            return new TransferListenerFunction({
                id: item.transaction.id,
                name: 'transferListener',
            })
        }
        case abi.functions['uri'].sighash: {
            let f = normalize(abi.functions['uri'].decode(item.transaction.input))
            return new UriFunction({
                id: item.transaction.id,
                name: 'uri',
                arg0: f[0],
            })
        }
    }
}
