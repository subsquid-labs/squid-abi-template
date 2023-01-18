import {runProgram} from '@subsquid/util-internal'
import {execSync} from 'child_process'
import {program} from 'commander'
import assert from 'assert'
import path from 'path'
import {SquidFragment, SquidFragmentParam, TypegenOutput} from './interfaces'
import {toEntityName, getGqlType} from './util'
import {ProcessorCodegen} from './processor'

runProgram(async function () {
    program
        .requiredOption(`--address <contract>`, `contract address`)
        .requiredOption(
            `--archive <url>`,
            `Archive endpoint for indexing. See https://docs.subsquid.io/ for the list of supported networks and Archive endpoints`
        )
        .option(`--abi <path>`, `path or URL to the contract ABI`)
        .option(
            `-e, --event <name...>`,
            `one or multiple contract events to be indexed. '*' indexes all events defined in the ABI`
        )
        .option(
            `-f, --function <name...>`,
            `one or multiple contract functions to be indexed. '*' indexes all functions defined in the ABI`
        )
        .option(`--from <block>`, `start indexing from the given block`)
        .option(
            `--etherscan-api <url>`,
            `an Etherscan API endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/`
        )

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

    let typegenFileName = opts.abi ? path.basename(opts.abi, `.json`) : opts.address
    let typegenFile = require(`../src/abi/${typegenFileName}.ts`)
    let events = getSquidEvents(typegenFile, opts.event || [])
    let functions = getSquidFunctions(typegenFile, opts.function || [])

    let from = opts.from ? parseInt(opts.from) : 0
    if (from != null) {
        assert(Number.isSafeInteger(from))
        assert(from >= 0)
    }

    new ProcessorCodegen({
        address: opts.address.toLowerCase(),
        archive: opts.archive,
        typegenFile,
        events,
        functions,
        from,
    }).generate()
})

function getSquidEvents(typegenFile: TypegenOutput, names: string[]): Record<string, SquidFragment> {
    let abiInterface = typegenFile.abi

    let events: Record<string, SquidFragment> = {}
    for (let name of names) {
        let fragment = typegenFile.events[name]?.fragment
        assert(fragment != null, `Event "${name}" doesn't exist for this contract`)

        let entityName = toEntityName(fragment.name)
        let overloads = Object.values(abiInterface.events).filter((f) => f.name === fragment.name)
        if (overloads.length > 1) {
            let num = overloads.findIndex((f) => f.inputs.every((i, n) => i.name === fragment.inputs[n].name))
            entityName += num
        }
        entityName += `Event`

        let params: SquidFragmentParam[] = []
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            params.push({
                name: `arg${i}`,
                indexed: input.indexed,
                schemaType: getGqlType(input),
            })
        }

        events[name] = {
            entityName,
            params,
        }
    }

    return events
}

function getSquidFunctions(typegenFile: TypegenOutput, names: string[]): Record<string, SquidFragment> {
    let abiInterface = typegenFile.abi

    let functions: Record<string, SquidFragment> = {}
    for (let name of names) {
        let fragment = typegenFile.functions[name]?.fragment
        assert(fragment != null, `Function "${name}" doesn't exist for this contract`)

        let entityName = toEntityName(fragment.name)
        let overloads = Object.values(abiInterface.functions).filter((f) => f.name === fragment.name)
        if (overloads.length > 1) {
            let num = overloads.findIndex((f) => f.inputs.every((i, n) => i.name === fragment.inputs[n].name))
            entityName += num
        }
        entityName += `Function`

        let params: SquidFragmentParam[] = []
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            params.push({
                name: `arg${i}`,
                indexed: input.indexed,
                schemaType: getGqlType(input),
            })
        }

        functions[name] = {
            entityName,
            params,
        }
    }

    return functions
}
