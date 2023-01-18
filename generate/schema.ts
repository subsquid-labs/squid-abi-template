import {FileOutput} from '@subsquid/util-internal-code-printer'
import {SquidFragment} from './interfaces'

export class SchemaCodegen {
    private out: FileOutput
    constructor(
        private options: {
            events: SquidFragment[]
            functions: SquidFragment[]
        }
    ) {
        this.out = new FileOutput(`./schema.graphql`)
    }

    generate() {
        this.out.block(`type Block @entity`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`number: Int! @index`)
            this.out.line(`timestamp: DateTime!`)
            this.out.line(`transactions: [Transaction] @derivedFrom(field: "block")`)
        })
        this.out.line()
        this.out.block(`type Transaction @entity`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`hash: String! @index`)
            this.out.line(`block: Block!`)
            this.out.line(`contract: String!`)
        })
        this.out.line()
        this.out.block(`interface Event @query`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`block: Block!`)
            this.out.line(`transaction: Transaction!`)
            this.out.line(`name: String!`)
        })
        for (let e of this.options.events) {
            this.out.line()
            this.out.block(`type ${e.entityName} implements Event @entity`, () => {
                this.out.line(`id: ID!`)
                this.out.line(`block: Block!`)
                this.out.line(`transaction: Transaction!`)
                this.out.line(`name: String! @index`)
                for (let param of e.params) {
                    let field = `${param.name}: ${param.schemaType}`
                    if (param.indexed) {
                        field += ` @index`
                    }
                    this.out.line(field)
                }
            })
        }
        this.out.line()
        this.out.block(`interface Function @query`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`block: Block!`)
            this.out.line(`transaction: Transaction!`)
            this.out.line(`name: String!`)
        })
        this.out.line()
        for (let f of this.options.functions) {
            this.out.line()
            this.out.block(`type ${f.entityName} implements Function @entity`, () => {
                this.out.line(`id: ID!`)
                this.out.line(`block: Block!`)
                this.out.line(`transaction: Transaction!`)
                this.out.line(`name: String! @index`)
                for (let param of f.params) {
                    let field = `${param.name}: ${param.schemaType}`
                    if (param.indexed) {
                        field += ` @index`
                    }
                    this.out.line(field)
                }
            })
        }

        this.out.write()
    }
}
