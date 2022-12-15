import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Block} from "./block.model"
import {EvmFunction} from "./evmFunction.model"
import {EvmEvent} from "./evmEvent.model"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Column_("text", {nullable: false})
    contract!: string


    @OneToMany_(() => EvmEvent, e => e.transaction)
    events!: EvmEvent[]
}
