import assert from 'assert'
import {spawn} from 'child_process'
import path from 'path'
import {program} from 'commander'
import {ethers} from 'ethers'
import {getType as getTsType} from '@subsquid/evm-typegen/lib/util/types'
import {runProgram} from '@subsquid/util-internal'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {SquidFragment, SquidFragmentParam, TypegenOutput} from './interfaces'
import {ProcessorCodegen} from './processor'
import {SchemaCodegen} from './schema'

runProgram(async function () {
    program
        .requiredOption(`--address <contract>`, `contract address`)
        .requiredOption(
            `--archive <url>`,
            `Archive endpoint for indexing. See https://docs.subsquid.io/ for the list of supported networks and Archive endpoints`
        )
        .option(`--proxy <contract>`, `proxy contract address`)
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
        proxy?: string
        abi?: string
        event?: string[]
        function?: string[]
        from?: string
        etherscanApi?: string
    }

    await spawnAsync(`squid-evm-typegen`, [
        `./src/abi`,
        `${opts.abi || opts.address}`,
        opts.etherscanApi ? `--etherscan-api ${opts.etherscanApi}` : ``,
        `--clean`,
    ])

    let typegenFileName = opts.abi ? path.basename(opts.abi, `.json`) : opts.address
    let typegenFile = require(`../src/abi/${typegenFileName}.ts`)

    let events = getFragments(`event`, typegenFile, opts.event || [])
    let functions = getFragments(`function`, typegenFile, opts.function || [])

    let from = opts.from ? parseInt(opts.from) : 0
    if (from != null) {
        assert(Number.isSafeInteger(from))
        assert(from >= 0)
    }

    let outputDir = new OutDir(`./`)
    new SchemaCodegen(outputDir, {
        events,
        functions,
    }).generate()

    await spawnAsync(`squid-typeorm-codegen`, [])

    let srcOutputDir = outputDir.child(`src`)
    new ProcessorCodegen(srcOutputDir, {
        address: (opts.proxy || opts.address).toLowerCase(),
        archive: opts.archive,
        typegenFileName,
        events,
        functions,
        from,
    }).generate()
})

function getFragments(kind: 'event' | 'function', typegenFile: TypegenOutput, names: string[]): SquidFragment[] {
    let abiInterface = typegenFile.abi
    let items = kind === 'event' ? typegenFile.events : typegenFile.functions

    if (names.includes(`*`)) {
        names = Object.keys(items)
    }

    let fragments: SquidFragment[] = []
    for (let name of names) {
        let fragment = items[name]?.fragment
        assert(fragment != null, `${kind === 'event' ? `Event` : `Function`} "${name}" doesn't exist for this contract`)

        let entityName = toEntityName(fragment.name)
        let overloads = Object.values(abiInterface.fragments).filter((f) => f.type === kind && toEntityName(f.name) === entityName)
        if (overloads.length > 1) {
            let num = overloads.findIndex((f) => f.format('sighash') === fragment.format('sighash'))
            entityName += num
        }
        entityName += kind === 'event' ? `Event` : `Function`

        let params: SquidFragmentParam[] = []
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            params.push({
                name: `arg${i}`,
                indexed: input.indexed,
                schemaType: getGqlType(input),
            })
        }

        fragments.push({
            name,
            entityName,
            params,
        })
    }

    return fragments
}

export function getGqlType(param: ethers.utils.ParamType): string {
    let tsType = getTsType(param)
    return tsTypeToGqlType(tsType)
}

function tsTypeToGqlType(type: string): string {
    if (type === 'string') {
        return 'String'
    } else if (type === 'boolean') {
        return 'Boolean'
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

async function spawnAsync(command: string, args: string[]) {
    return await new Promise<number>((resolve, reject) => {
        let proc = spawn(command, args, {
            stdio: 'inherit',
            shell: process.platform == 'win32',
        })

        proc.on('error', (err) => {
            reject(err)
        })

        proc.on('close', (code) => {
            if (code == 0) {
                resolve(code)
            } else {
                reject(`error: command "${command}" exited with code ${code}`)
            }
        })
    })
}
