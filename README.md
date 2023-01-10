# Squid ABI template

An experimental template is used to generate a squid indexing EVM logs and transactions of choice from a contract address. Supports automatic ABI lookups for public contracts using the Etherescan API

## Usage

0. Install the [Squid CLI](https://docs.subsquid.io/squid-cli/)

1. Init the template and install the dependcies

```bash
sqd init my-abi-squid --template https://github.com/subsquid/squid-abi-template
cd my-abi-squid
npm i
```

2. Run `npm run generate` with the appropriate flags.

```bash
Usage: ts-node generate/run.ts [options]

Options:
  --address <contract>      contract address
  --archive <url>           archive endpoint 
  --abi <path>              (optional) path to the abi file. If omitted, the Etherscan API is used
  -e, --event <name...>     one or multiple events to be indexed. '*' will index all events
  -f, --function <name...>. one or multiple contract functions to be indexed. '*' will index all functions
  --from <block>            start indexing from the given block. 
  --etherscan-api <url>     (Optional) An Etherscan-compatible API to fetch contract ABI by a known address. Default: https://api.etherscan.io/
```

3. Build and run the squid

```bash
make codegen
npm run build
make up
make process
```
The indexing will start.

In a separate window, start the GraphQL API server at `localhost:4350/graphql`:
```bash
make serve
```

For more details how to build and deploy a squid, see the [docs](https://docs.subsquid.io).

## Example

```bash
npm run generate -- \
--address 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC \
--archive https://eth.archive.subsquid.io \
--event NewGravatar \
--event UpdatedGravatar \
--function createGravatar \
--from 10000000
```

<img width="1156" alt="Screenshot 2023-01-10 at 13 03 16" src="https://user-images.githubusercontent.com/8627422/211521452-610e90b6-cb24-4e16-a852-15c8d7f11c28.png">

