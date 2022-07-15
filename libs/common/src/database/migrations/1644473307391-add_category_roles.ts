import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCategoryRoles1644473307391 implements MigrationInterface {
  name = 'addCategoryRoles1644473307391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`writable_article\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`readable_article\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`writable_comment\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`readable_comment\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`reactionable\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(`ALTER TABLE \`category\` ADD \`anonymity\` tinyint NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`anonymity\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`reactionable\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`readable_comment\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`writable_comment\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`readable_article\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`writable_article\``);
  }
}
