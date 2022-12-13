module.exports = class Data1670957651287 {
    name = 'Data1670957651287'

    async up(db) {
        await db.query(`CREATE TABLE "evm_event" ("id" character varying NOT NULL, "block" integer NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, CONSTRAINT "PK_44bf1b82a2d71af8a303f7cb835" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "evm_transaction" ("id" character varying NOT NULL, "block" integer NOT NULL, "hash" text NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, CONSTRAINT "PK_5cb059f05ba72ac04ac1cfb3775" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "evm_event"`)
        await db.query(`DROP TABLE "evm_transaction"`)
    }
}
