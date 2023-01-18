import {getType as getTsType} from '@subsquid/evm-typegen/lib/util/types'
import {toCamelCase} from '@subsquid/util-naming'
import {ethers} from 'ethers'


export function getGqlType(param: ethers.utils.ParamType): string {
    let tsType = getTsType(param)
    return tsTypeToGqlType(tsType)
}

function tsTypeToGqlType(type: string): string {
    if (type === 'string') {
        return 'String'
    } else if (type === 'boolean') {
        return 'Bool'
    } else if (type === 'number') {
        return 'Int'
    } else if (type === 'ethers.BigNumber') {
        return 'BigInt'
    } else {
        return 'JSON'
    }
}

export function toEntityName(name: string) {
    let camelCased = toCamelCase(name)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}