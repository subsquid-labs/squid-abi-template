import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class EvmFunction {
    constructor(props?: Partial<EvmFunction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("text", {nullable: false})
    txHash!: string

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    params!: unknown
}
