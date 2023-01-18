import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class RoleAdminChangedEvent {
    constructor(props?: Partial<RoleAdminChangedEvent>) {
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

    @Index_()
    @Column_("text", {nullable: true})
    arg0!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    arg1!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    arg2!: string | undefined | null
}
