import {MigrationInterface, QueryRunner} from "typeorm";

export class oauth1539857080883 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "o_auth_refresh_token" ("refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "clientId" uuid, CONSTRAINT "PK_9c28879e57249cd37a166d16475" PRIMARY KEY ("refreshToken"))`);
        await queryRunner.query(`CREATE TABLE "o_auth_authorization_code" ("authorizationCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "clientId" uuid, CONSTRAINT "PK_96aa4de267872e7ce1cd019f41d" PRIMARY KEY ("authorizationCode"))`);
        await queryRunner.query(`CREATE TABLE "o_auth_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "redirectUris" text array NOT NULL, "grants" text array NOT NULL, "scopes" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_bb5360d8a267cd78c52e205311b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "o_auth_access_token" ("accessToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "clientId" uuid, CONSTRAINT "PK_92b142fe013a181064be1ebab6f" PRIMARY KEY ("accessToken"))`);
        await queryRunner.query(`DROP INDEX "IDX_02e8e506a27b04322a98dc893a"`);
        await queryRunner.query(`ALTER TYPE "social_login_type_enum" RENAME TO "social_login_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "social_login_type_enum" AS ENUM('Google', 'Twitter', '0', '1')`);
        await queryRunner.query(`ALTER TABLE "social_login" ALTER COLUMN "type" TYPE "social_login_type_enum" USING "type"::"text"::"social_login_type_enum"`);
        await queryRunner.query(`DROP TYPE "social_login_type_enum_old"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_02e8e506a27b04322a98dc893a" ON "social_login"("type", "clientId") `);
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" ADD CONSTRAINT "FK_dbe6282a581b4e0281f898536af" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" ADD CONSTRAINT "FK_8e5fe8dfd1555c6dfd3f3ce16b0" FOREIGN KEY ("clientId") REFERENCES "o_auth_client"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_authorization_code" ADD CONSTRAINT "FK_72f9aeeaa44e6d1d3379c3943eb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_authorization_code" ADD CONSTRAINT "FK_cd8babdb98ae206153c5589071b" FOREIGN KEY ("clientId") REFERENCES "o_auth_client"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_client" ADD CONSTRAINT "FK_75aacf032d9730c7a54c464f985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" ADD CONSTRAINT "FK_439df814d074c444e019b70fe41" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" ADD CONSTRAINT "FK_9c74e1755232ac931c59ce0c851" FOREIGN KEY ("clientId") REFERENCES "o_auth_client"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" DROP CONSTRAINT "FK_9c74e1755232ac931c59ce0c851"`);
        await queryRunner.query(`ALTER TABLE "o_auth_access_token" DROP CONSTRAINT "FK_439df814d074c444e019b70fe41"`);
        await queryRunner.query(`ALTER TABLE "o_auth_client" DROP CONSTRAINT "FK_75aacf032d9730c7a54c464f985"`);
        await queryRunner.query(`ALTER TABLE "o_auth_authorization_code" DROP CONSTRAINT "FK_cd8babdb98ae206153c5589071b"`);
        await queryRunner.query(`ALTER TABLE "o_auth_authorization_code" DROP CONSTRAINT "FK_72f9aeeaa44e6d1d3379c3943eb"`);
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" DROP CONSTRAINT "FK_8e5fe8dfd1555c6dfd3f3ce16b0"`);
        await queryRunner.query(`ALTER TABLE "o_auth_refresh_token" DROP CONSTRAINT "FK_dbe6282a581b4e0281f898536af"`);
        await queryRunner.query(`DROP INDEX "IDX_02e8e506a27b04322a98dc893a"`);
        await queryRunner.query(`CREATE TYPE "social_login_type_enum_old" AS ENUM('Google', 'Twitter', '0', '1')`);
        await queryRunner.query(`ALTER TABLE "social_login" ALTER COLUMN "type" TYPE "social_login_type_enum_old" USING "type"::"text"::"social_login_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "social_login_type_enum"`);
        await queryRunner.query(`ALTER TYPE "social_login_type_enum_old" RENAME TO "social_login_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_02e8e506a27b04322a98dc893a" ON "social_login"("type", "clientId") `);
        await queryRunner.query(`DROP TABLE "o_auth_access_token"`);
        await queryRunner.query(`DROP TABLE "o_auth_client"`);
        await queryRunner.query(`DROP TABLE "o_auth_authorization_code"`);
        await queryRunner.query(`DROP TABLE "o_auth_refresh_token"`);
    }

}
