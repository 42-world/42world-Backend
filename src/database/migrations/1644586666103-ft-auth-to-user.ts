import { MigrationInterface, QueryRunner } from 'typeorm';

export class ftAuthToUser1644586666103 implements MigrationInterface {
  name = 'ftAuthToUser1644586666103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e2364281027b926b879fa2fa1e\` ON \`user\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`oauth_token\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`github_username\` varchar(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_07eccd596501ea0b6b1805a2f1\` (\`github_username\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`intra_id\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`github_uid\` varchar(42) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`github_uid\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`intra_id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_07eccd596501ea0b6b1805a2f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`github_username\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`oauth_token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_e2364281027b926b879fa2fa1e\` ON \`user\` (\`nickname\`)`,
    );
  }
}
