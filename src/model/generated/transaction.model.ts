import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Block} from "./block.model"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    hash!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Column_("text", {nullable: true})
    contract!: string | undefined | null
}
