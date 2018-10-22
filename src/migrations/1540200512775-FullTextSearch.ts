import {MigrationInterface, QueryRunner} from "typeorm";

export class FullTextSearch1540200512775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
        await queryRunner.query(`CREATE TEXT SEARCH CONFIGURATION pt ( COPY = portuguese )`);
        await queryRunner.query(`ALTER TEXT SEARCH CONFIGURATION pt ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem`);
        await queryRunner.query(`ALTER TABLE "card" ADD "searchVector" tsvector`);
        await queryRunner.query(`CREATE INDEX card_search_idx ON "card" USING gin("searchVector")`);
        await queryRunner.query(`CREATE TRIGGER card_search_update BEFORE INSERT OR UPDATE ON "card" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("searchVector", 'public.pt', title, description)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TRIGGER "card_search_update" ON "card"`);
        await queryRunner.query(`DROP INDEX "card_search_idx"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "searchVector"`);
        await queryRunner.query(`DROP TEXT SEARCH CONFIGURATION pt`);
        await queryRunner.query(`DROP EXTENSION unaccent`);
    }

}
