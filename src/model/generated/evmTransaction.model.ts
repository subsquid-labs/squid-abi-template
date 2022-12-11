import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class EvmTransaction {
    constructor(props?: Partial<EvmTransaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    params!: unknown
}
