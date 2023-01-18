import {ethers} from 'ethers'

export function normalize(val: unknown) {
    switch (typeof val) {
        case 'object':
            if (val == null) {
                return null
            } else if (val instanceof ethers.BigNumber) {
                return val.toBigInt()
            } else if (Array.isArray(val)) {
                return normalizeArray(val)
            } else {
                return normalizeObject(val)
            }
        default:
            return val
    }
}

function normalizeArray(val: unknown[]): any[] {
    let arr = new Array(val.length)
    for (let i = 0; i < val.length; i++) {
        arr[i] = normalize(val[i])
    }
    return arr
}

function normalizeObject(val: any): any {
    let result: any = {}
    for (let key in val) {
        result[key] = normalize(val[key])
    }
    return result
}
