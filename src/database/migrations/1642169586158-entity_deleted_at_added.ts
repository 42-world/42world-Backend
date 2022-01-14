import {MigrationInterface, QueryRunner} from "typeorm";

export class entityDeletedAtAdded1642169586158 implements MigrationInterface {
    name = 'entityDeletedAtAdded1642169586158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`is_active\` \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`deleted_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`time\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD \`deleted_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`content\` \`content\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deleted_at\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deleted_at\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`content\` \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`article\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`time\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
    }

}
