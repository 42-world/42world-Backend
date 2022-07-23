import { MigrationInterface, QueryRunner } from 'typeorm';

export class intraAuth1645622620898 implements MigrationInterface {
  name = 'intraAuth1645622620898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_e2364281027b926b879fa2fa1e\` ON \`user\``);
    await queryRunner.query(`ALTER TABLE \`ft_auth\` RENAME TO \`intra_auth\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`oauth_token\` \`github_uid\` varchar(42) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`github_username\` varchar(20) NOT NULL AFTER \`character\``);
    await queryRunner.query(`UPDATE user SET github_username = nickname;`);
    await queryRunner.query(
      `UPDATE user, intra_auth SET user.nickname = intra_auth.intra_id WHERE user.id = intra_auth.user_id;`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_07eccd596501ea0b6b1805a2f1\` (\`github_username\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_07eccd596501ea0b6b1805a2f1\``);
    await queryRunner.query(`UPDATE user SET nickname = github_username;`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`github_username\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`github_uid\` \`oauth_token\` varchar(42) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`intra_auth\` RENAME TO \`ft_auth\``);
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e2364281027b926b879fa2fa1e\` ON \`user\` (\`nickname\`)`);
  }
}
