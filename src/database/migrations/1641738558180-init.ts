import {MigrationInterface, QueryRunner} from "typeorm";

export class init1641738558180 implements MigrationInterface {
    name = 'init1641738558180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authenticate" ("id" SERIAL NOT NULL, "intra_id" character varying(40) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_12b9db17999f80b8cae9a73ca91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "ix_intra_id" ON "authenticate" ("intra_id") `);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "article_id" integer NOT NULL, "writer_id" integer NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "ix_comment_article_id" ON "comment" ("article_id") `);
        await queryRunner.query(`CREATE INDEX "ix_comment_writer_id" ON "comment" ("writer_id") `);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('NEW_COMMENT', 'FROM_ADMIN')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "type" "public"."notification_type_enum" NOT NULL DEFAULT 'FROM_ADMIN', "content" text, "time" TIMESTAMP, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "ix_notification_user_id" ON "notification" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('CADET', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "nickname" character varying(20) NOT NULL, "oauth_token" character varying(255), "is_authenticated" boolean NOT NULL DEFAULT false, "refresh_token" character varying(255), "role" "public"."user_role_enum" NOT NULL DEFAULT 'CADET', "picture" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying(255), "content" character varying(255), "view_count" integer NOT NULL DEFAULT '0', "category_id" integer NOT NULL, "writer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "ix_article_title" ON "article" ("title") `);
        await queryRunner.query(`CREATE INDEX "ix_article_category_id" ON "article" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "ix_article_writer_id" ON "article" ("writer_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."ix_article_writer_id"`);
        await queryRunner.query(`DROP INDEX "public"."ix_article_category_id"`);
        await queryRunner.query(`DROP INDEX "public"."ix_article_title"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."ix_notification_user_id"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."ix_comment_writer_id"`);
        await queryRunner.query(`DROP INDEX "public"."ix_comment_article_id"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP INDEX "public"."ix_intra_id"`);
        await queryRunner.query(`DROP TABLE "authenticate"`);
    }

}
