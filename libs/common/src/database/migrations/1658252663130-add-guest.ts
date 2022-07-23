import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGuest1658252663130 implements MigrationInterface {
  name = 'addGuest1658252663130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`writable_article\` \`writable_article\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`readable_article\` \`readable_article\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`writable_comment\` \`writable_comment\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`readable_comment\` \`readable_comment\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`reactionable\` \`reactionable\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('CADET', 'ADMIN', 'NOVICE', 'GUEST') NOT NULL DEFAULT 'NOVICE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'NOVICE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`reactionable\` \`reactionable\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`readable_comment\` \`readable_comment\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`writable_comment\` \`writable_comment\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`readable_article\` \`readable_article\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` CHANGE \`writable_article\` \`writable_article\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'CADET'`,
    );
  }
}
