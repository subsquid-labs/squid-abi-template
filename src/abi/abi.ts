import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './abi.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, approved: string, tokenId: ethers.BigNumber] & {owner: string, approved: string, tokenId: ethers.BigNumber})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    ContractURI: new LogEvent<[]>(
        abi, '0xff4ccd353885f015d383bdfcccc32f90e1573a6ec9da3c355dc74a39e1021059'
    ),
    Lock: new LogEvent<([supply: ethers.BigNumber] & {supply: ethers.BigNumber})>(
        abi, '0x57424d5909ad92dd80fbaa1967a047a5975a0e9bb94726d561734e667cdf4227'
    ),
    RoleAdminChanged: new LogEvent<([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})>(
        abi, '0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff'
    ),
    RoleGranted: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'
    ),
    RoleRevoked: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b'
    ),
    SecondarySaleFee: new LogEvent<([feeRecipient: string, feeValueBps: ethers.BigNumber] & {feeRecipient: string, feeValueBps: ethers.BigNumber})>(
        abi, '0xff1fd4151acecc8a2e88c4741c30f16103d745f2a593af078b174b4bce0cf08d'
    ),
    Transfer: new LogEvent<([from: string, to: string, tokenId: ethers.BigNumber] & {from: string, to: string, tokenId: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    URI: new LogEvent<([tokenId: ethers.BigNumber] & {tokenId: ethers.BigNumber})>(
        abi, '0x901e1c01b493ffa41590ea147378e25dde9601a9390b52eb75d4e0e2118a44a5'
    ),
    URIAll: new LogEvent<[]>(
        abi, '0x9bf13f1005bf8940f6b531a89ba63b7fbd1b63269d49cc5612e9268b07d2527d'
    ),
}

export const functions = {
    COMPOSITE_CREATOR_ROLE: new Func<[], {}, string>(
        abi, '0xda143236'
    ),
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    GOVERNANCE_ROLE: new Func<[], {}, string>(
        abi, '0xf36c8f5c'
    ),
    MINTER_ROLE: new Func<[], {}, string>(
        abi, '0xd5391393'
    ),
    OPERATOR_ROLE: new Func<[], {}, string>(
        abi, '0xf5b541a6'
    ),
    VERSION: new Func<[], {}, ethers.BigNumber>(
        abi, '0xffa1ad74'
    ),
    approve: new Func<[to: string, tokenId: ethers.BigNumber], {to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, ethers.BigNumber>(
        abi, '0x70a08231'
    ),
    batch: new Func<[calls: Array<string>, revertOnFail: boolean], {calls: Array<string>, revertOnFail: boolean}, []>(
        abi, '0xd2423b51'
    ),
    burn: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, []>(
        abi, '0x42966c68'
    ),
    compositeURI: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0xbd7a8f2b'
    ),
    contractURI: new Func<[], {}, string>(
        abi, '0xe8a3d485'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    defaultTokenURI: new Func<[], {}, string>(
        abi, '0x963bfe12'
    ),
    erc2665Handler: new Func<[], {}, string>(
        abi, '0xb6a0274b'
    ),
    exists: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, boolean>(
        abi, '0x4f558e79'
    ),
    getApproved: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0x081812fc'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    getRoleMember: new Func<[role: string, index: ethers.BigNumber], {role: string, index: ethers.BigNumber}, string>(
        abi, '0x9010d07c'
    ),
    getRoleMemberCount: new Func<[role: string], {role: string}, ethers.BigNumber>(
        abi, '0xca15c873'
    ),
    'getTransferFee(uint256)': new Func<[_tokenId: ethers.BigNumber], {_tokenId: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x56c1e949'
    ),
    'getTransferFee(uint256,string)': new Func<[_tokenId: ethers.BigNumber, _currencySymbol: string], {_tokenId: ethers.BigNumber, _currencySymbol: string}, ethers.BigNumber>(
        abi, '0x86f24f20'
    ),
    globalCompositeTokenURIBase: new Func<[], {}, string>(
        abi, '0x5c3e0c44'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    initialize: new Func<[owner: string, admin: string, minter: string, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string], {owner: string, admin: string, minter: string, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string}, []>(
        abi, '0x4cee5981'
    ),
    initialized: new Func<[], {}, boolean>(
        abi, '0x158ef93e'
    ),
    isApprovedForAll: new Func<[_owner: string, _operator: string], {_owner: string, _operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    isProxy: new Func<[_address: string, _operator: string], {_address: string, _operator: string}, boolean>(
        abi, '0x76d1f139'
    ),
    lock: new Func<[], {}, []>(
        abi, '0xf83d08ba'
    ),
    lockedForever: new Func<[], {}, boolean>(
        abi, '0x640bd61a'
    ),
    mint: new Func<[to: string, _customTokenURI: string], {to: string, _customTokenURI: string}, []>(
        abi, '0xd0def521'
    ),
    mintDefault: new Func<[to: string], {to: string}, []>(
        abi, '0x1ad33033'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    originalURI: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0xdf9ba231'
    ),
    ownerOf: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0x6352211e'
    ),
    proxyRegistry: new Func<[], {}, string>(
        abi, '0xb50cbd9f'
    ),
    renounceRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    royaltyInfo: new Func<[_: ethers.BigNumber, _salePrice: ethers.BigNumber], {_salePrice: ethers.BigNumber}, ([receiver: string, royaltyAmount: ethers.BigNumber] & {receiver: string, royaltyAmount: ethers.BigNumber})>(
        abi, '0x2a55205a'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: ethers.BigNumber], {from: string, to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: ethers.BigNumber, data: string], {from: string, to: string, tokenId: ethers.BigNumber, data: string}, []>(
        abi, '0xb88d4fde'
    ),
    secondarySaleFee: new Func<[_: ethers.BigNumber], {}, [_: string, _: ethers.BigNumber]>(
        abi, '0x4322d9b7'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    setContractURI: new Func<[contractURI: string], {contractURI: string}, []>(
        abi, '0x938e3d7b'
    ),
    setCustomCompositeTokenURIBase: new Func<[_id: ethers.BigNumber, _customCompositeTokenURIBase: string], {_id: ethers.BigNumber, _customCompositeTokenURIBase: string}, []>(
        abi, '0x11fb4c60'
    ),
    setCustomTokenURI: new Func<[_id: ethers.BigNumber, _customTokenURI: string], {_id: ethers.BigNumber, _customTokenURI: string}, []>(
        abi, '0x851fc4b6'
    ),
    setDefaultTokenURI: new Func<[_defaultTokenURI: string], {_defaultTokenURI: string}, []>(
        abi, '0xa125c824'
    ),
    setERC2665Handler: new Func<[_erc2665Handler: string], {_erc2665Handler: string}, []>(
        abi, '0x9b5b8d86'
    ),
    setFee: new Func<[_feeRecipient: string, _feeValueBps: ethers.BigNumber], {_feeRecipient: string, _feeValueBps: ethers.BigNumber}, []>(
        abi, '0xe55156b5'
    ),
    setGlobalCompositeTokenURIBase: new Func<[_globalCompositeTokenURIBase: string], {_globalCompositeTokenURIBase: string}, []>(
        abi, '0xb36d0f87'
    ),
    setProxyRegistryAddress: new Func<[_proxyRegistryAddress: string], {_proxyRegistryAddress: string}, []>(
        abi, '0xd26ea6c0'
    ),
    setTransferListener: new Func<[_transferListener: string], {_transferListener: string}, []>(
        abi, '0x2376bf3f'
    ),
    setUseCompositeTokenURI: new Func<[_id: ethers.BigNumber, _useComposite: boolean], {_id: ethers.BigNumber, _useComposite: boolean}, []>(
        abi, '0x28cf18db'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    tokenURI: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0xc87b56dd'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: ethers.BigNumber], {from: string, to: string, tokenId: ethers.BigNumber}, []>(
        abi, '0x23b872dd'
    ),
    transferListener: new Func<[], {}, string>(
        abi, '0x538ee007'
    ),
    uri: new Func<[tokenId: ethers.BigNumber], {tokenId: ethers.BigNumber}, string>(
        abi, '0x0e89341c'
    ),
}

export class Contract extends ContractBase {

    COMPOSITE_CREATOR_ROLE(): Promise<string> {
        return this.eth_call(functions.COMPOSITE_CREATOR_ROLE, [])
    }

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    GOVERNANCE_ROLE(): Promise<string> {
        return this.eth_call(functions.GOVERNANCE_ROLE, [])
    }

    MINTER_ROLE(): Promise<string> {
        return this.eth_call(functions.MINTER_ROLE, [])
    }

    OPERATOR_ROLE(): Promise<string> {
        return this.eth_call(functions.OPERATOR_ROLE, [])
    }

    VERSION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.VERSION, [])
    }

    balanceOf(owner: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    compositeURI(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.compositeURI, [tokenId])
    }

    contractURI(): Promise<string> {
        return this.eth_call(functions.contractURI, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    defaultTokenURI(): Promise<string> {
        return this.eth_call(functions.defaultTokenURI, [])
    }

    erc2665Handler(): Promise<string> {
        return this.eth_call(functions.erc2665Handler, [])
    }

    exists(tokenId: ethers.BigNumber): Promise<boolean> {
        return this.eth_call(functions.exists, [tokenId])
    }

    getApproved(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    getRoleMember(role: string, index: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.getRoleMember, [role, index])
    }

    getRoleMemberCount(role: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getRoleMemberCount, [role])
    }

    'getTransferFee(uint256)'(_tokenId: ethers.BigNumber): Promise<ethers.BigNumber> {
        return this.eth_call(functions['getTransferFee(uint256)'], [_tokenId])
    }

    'getTransferFee(uint256,string)'(_tokenId: ethers.BigNumber, _currencySymbol: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions['getTransferFee(uint256,string)'], [_tokenId, _currencySymbol])
    }

    globalCompositeTokenURIBase(): Promise<string> {
        return this.eth_call(functions.globalCompositeTokenURIBase, [])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    initialized(): Promise<boolean> {
        return this.eth_call(functions.initialized, [])
    }

    isApprovedForAll(_owner: string, _operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [_owner, _operator])
    }

    isProxy(_address: string, _operator: string): Promise<boolean> {
        return this.eth_call(functions.isProxy, [_address, _operator])
    }

    lockedForever(): Promise<boolean> {
        return this.eth_call(functions.lockedForever, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    originalURI(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.originalURI, [tokenId])
    }

    ownerOf(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    proxyRegistry(): Promise<string> {
        return this.eth_call(functions.proxyRegistry, [])
    }

    royaltyInfo(arg0: ethers.BigNumber, _salePrice: ethers.BigNumber): Promise<([receiver: string, royaltyAmount: ethers.BigNumber] & {receiver: string, royaltyAmount: ethers.BigNumber})> {
        return this.eth_call(functions.royaltyInfo, [arg0, _salePrice])
    }

    secondarySaleFee(arg0: ethers.BigNumber): Promise<[_: string, _: ethers.BigNumber]> {
        return this.eth_call(functions.secondarySaleFee, [arg0])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenURI(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }

    transferListener(): Promise<string> {
        return this.eth_call(functions.transferListener, [])
    }

    uri(tokenId: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.uri, [tokenId])
    }
}
