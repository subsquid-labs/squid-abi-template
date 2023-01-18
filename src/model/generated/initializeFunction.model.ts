import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class InitializeFunction {
    constructor(props?: Partial<InitializeFunction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Index_()
    @ManyToOne_(() => Transaction, {nullable: true})
    transaction!: Transaction

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: true})
    arg0!: string | undefined | null

    @Column_("text", {nullable: true})
    arg1!: string | undefined | null

    @Column_("text", {nullable: true})
    arg2!: string | undefined | null

    @Column_("text", {nullable: true})
    arg3!: string | undefined | null

    @Column_("text", {nullable: true})
    arg4!: string | undefined | null

    @Column_("int4", {nullable: true})
    arg5!: number | undefined | null

    @Column_("text", {nullable: true})
    arg6!: string | undefined | null

    @Column_("text", {nullable: true})
    arg7!: string | undefined | null

    @Column_("text", {nullable: true})
    arg8!: string | undefined | null
}
