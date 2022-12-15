import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToOne as OneToOne_, JoinColumn as JoinColumn_} from "typeorm"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class EvmFunction {
    constructor(props?: Partial<EvmFunction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Index_({unique: true})
    @OneToOne_(() => Transaction, {nullable: false})
    @JoinColumn_()
    transaction!: Transaction

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    params!: unknown
}
