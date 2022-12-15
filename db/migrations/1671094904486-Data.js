module.exports = class Data1671094904486 {
    name = 'Data1671094904486'

    async up(db) {
        await db.query(`CREATE TABLE "evm_event" ("id" character varying NOT NULL, "block" integer NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, CONSTRAINT "PK_44bf1b82a2d71af8a303f7cb835" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_920ccbc92bf769f2d8dc8e6944" ON "evm_event" ("name") `)
        await db.query(`CREATE TABLE "evm_function" ("id" character varying NOT NULL, "block" integer NOT NULL, "tx_hash" text NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, CONSTRAINT "PK_88cc016f0fab68f1315d99ce62f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e5e91b512f381efe4d803c1806" ON "evm_function" ("name") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "evm_event"`)
        await db.query(`DROP INDEX "public"."IDX_920ccbc92bf769f2d8dc8e6944"`)
        await db.query(`DROP TABLE "evm_function"`)
        await db.query(`DROP INDEX "public"."IDX_e5e91b512f381efe4d803c1806"`)
    }
}
