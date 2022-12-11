import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class EvmEvent {
    constructor(props?: Partial<EvmEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    block!: number

    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    params!: unknown
}
