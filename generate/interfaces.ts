import {ethers} from "ethers"

export interface TypegenOutput {
    abi: ethers.utils.Interface
    events: Record<string, {fragment: ethers.utils.EventFragment}>
    functions: Record<string, {fragment: ethers.utils.FunctionFragment}>
}

export interface SquidFragmentParam {
    name: string
    schemaType: string
    indexed: boolean
}

export interface SquidFragment {
    name: string
    entityName: string
    params: SquidFragmentParam[]
}