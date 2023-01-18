import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Transaction} from "./transaction.model"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    number!: number

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @OneToMany_(() => Transaction, e => e.block)
    transactions!: Transaction[]
}
