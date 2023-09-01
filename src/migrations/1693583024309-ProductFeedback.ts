import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class ProductFeedback1693583024309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "product_feedback" ("id" character varying NOT NULL, 
            "product_id" character varying NOT NULL, 
            "customer_id" character varying NOT NULL, 
            "rating" integer NOT NULL, 
            "title" character varying NOT NULL, 
            "body" character varying NOT NULL, 
            "approved" boolean NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`
        )
        await queryRunner.createPrimaryKey("product_feedback", ["id"])
        await queryRunner.createForeignKey("product_feedback", new TableForeignKey({
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "product",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
