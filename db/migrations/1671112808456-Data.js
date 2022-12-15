module.exports = class Data1671112808456 {
    name = 'Data1671112808456'

    async up(db) {
        await db.query(`CREATE TABLE "evm_event" ("id" character varying NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, "block_id" character varying, "transaction_id" character varying, CONSTRAINT "PK_44bf1b82a2d71af8a303f7cb835" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6ff61ffc7cbb34a9f078a47336" ON "evm_event" ("block_id") `)
        await db.query(`CREATE INDEX "IDX_2cfa4e97582080c64ec0ace04e" ON "evm_event" ("transaction_id") `)
        await db.query(`CREATE INDEX "IDX_920ccbc92bf769f2d8dc8e6944" ON "evm_event" ("name") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "hash" text NOT NULL, "contract" text NOT NULL, "block_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c0e1460f3c9eee975fee81002d" ON "transaction" ("block_id") `)
        await db.query(`CREATE TABLE "evm_function" ("id" character varying NOT NULL, "name" text NOT NULL, "params" jsonb NOT NULL, "block_id" character varying, "transaction_id" character varying NOT NULL, CONSTRAINT "REL_17e5a6b13f5fc9fb1f187bca2a" UNIQUE ("transaction_id"), CONSTRAINT "PK_88cc016f0fab68f1315d99ce62f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0d1be646b4368f16e127aae02b" ON "evm_function" ("block_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_17e5a6b13f5fc9fb1f187bca2a" ON "evm_function" ("transaction_id") `)
        await db.query(`CREATE INDEX "IDX_e5e91b512f381efe4d803c1806" ON "evm_function" ("name") `)
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_38414873c187a3e0c7943bc4c7" ON "block" ("number") `)
        await db.query(`ALTER TABLE "evm_event" ADD CONSTRAINT "FK_6ff61ffc7cbb34a9f078a473367" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "evm_event" ADD CONSTRAINT "FK_2cfa4e97582080c64ec0ace04e4" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_c0e1460f3c9eee975fee81002dc" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "evm_function" ADD CONSTRAINT "FK_0d1be646b4368f16e127aae02b2" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "evm_function" ADD CONSTRAINT "FK_17e5a6b13f5fc9fb1f187bca2a3" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "evm_event"`)
        await db.query(`DROP INDEX "public"."IDX_6ff61ffc7cbb34a9f078a47336"`)
        await db.query(`DROP INDEX "public"."IDX_2cfa4e97582080c64ec0ace04e"`)
        await db.query(`DROP INDEX "public"."IDX_920ccbc92bf769f2d8dc8e6944"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_c0e1460f3c9eee975fee81002d"`)
        await db.query(`DROP TABLE "evm_function"`)
        await db.query(`DROP INDEX "public"."IDX_0d1be646b4368f16e127aae02b"`)
        await db.query(`DROP INDEX "public"."IDX_17e5a6b13f5fc9fb1f187bca2a"`)
        await db.query(`DROP INDEX "public"."IDX_e5e91b512f381efe4d803c1806"`)
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP INDEX "public"."IDX_38414873c187a3e0c7943bc4c7"`)
        await db.query(`ALTER TABLE "evm_event" DROP CONSTRAINT "FK_6ff61ffc7cbb34a9f078a473367"`)
        await db.query(`ALTER TABLE "evm_event" DROP CONSTRAINT "FK_2cfa4e97582080c64ec0ace04e4"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_c0e1460f3c9eee975fee81002dc"`)
        await db.query(`ALTER TABLE "evm_function" DROP CONSTRAINT "FK_0d1be646b4368f16e127aae02b2"`)
        await db.query(`ALTER TABLE "evm_function" DROP CONSTRAINT "FK_17e5a6b13f5fc9fb1f187bca2a3"`)
    }
}
