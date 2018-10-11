import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1539262971288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text, "done" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" text, "password" text, "email" text NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "social_login_type_enum" AS ENUM('Google', 'Twitter', '0', '1')`);
        await queryRunner.query(`CREATE TABLE "social_login" ("type" "social_login_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "clientId" text NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_697a715c6d9ae9886912009685d" PRIMARY KEY ("type", "userId"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_02e8e506a27b04322a98dc893a" ON "social_login"("type", "clientId") `);
        await queryRunner.query(`ALTER TABLE "social_login" ADD CONSTRAINT "FK_83cf7c30a11f788f67ffd66577d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "social_login" DROP CONSTRAINT "FK_83cf7c30a11f788f67ffd66577d"`);
        await queryRunner.query(`DROP INDEX "IDX_02e8e506a27b04322a98dc893a"`);
        await queryRunner.query(`DROP TABLE "social_login"`);
        await queryRunner.query(`DROP TYPE "social_login_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "card"`);
    }

}
