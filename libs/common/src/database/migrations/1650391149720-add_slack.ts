import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSlack1650391149720 implements MigrationInterface {
  name = 'addSlack1650391149720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP INDEX \`IDX_77cda6c3364a4de9050c779535\` ON \`intra_auth\``);
    await queryRunner.query(
      `CREATE TABLE \`slack\` (\`id\` int NOT NULL AUTO_INCREMENT, \`client_msg_id\` varchar(64) NOT NULL, \`text\` text NOT NULL, \`user\` varchar(16) NOT NULL, \`channel_id\` varchar(16) NOT NULL, \`ts\` varchar(32) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`ix_deleted_at\` (\`deleted_at\`), UNIQUE INDEX \`IDX_8aa3228eec2d1c6361e95fd6f6\` (\`client_msg_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article\` ADD \`slack_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article\` ADD UNIQUE INDEX \`IDX_d78c76119c9eb32bfc02593991\` (\`slack_id\`)`,
    );
    // await queryRunner.query(`DROP INDEX \`ix_intra_id\` ON \`intra_auth\``);
    // await queryRunner.query(`ALTER TABLE \`intra_auth\` DROP COLUMN \`intra_id\``);
    // await queryRunner.query(`ALTER TABLE \`intra_auth\` ADD \`intra_id\` varchar(20) NOT NULL`);
    // await queryRunner.query(`CREATE INDEX \`ix_intra_id\` ON \`intra_auth\` (\`intra_id\`)`);
    // await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_536be070e8a2f68f26eb17f007\` ON \`intra_auth\` (\`user_id\`)`);
    await queryRunner.query(
      `CREATE INDEX \`ix_slack_id\` ON \`article\` (\`slack_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`ix_slack_id\` ON \`article\``);
    // await queryRunner.query(`DROP INDEX \`IDX_536be070e8a2f68f26eb17f007\` ON \`intra_auth\``);
    // await queryRunner.query(`DROP INDEX \`ix_intra_id\` ON \`intra_auth\``);
    // await queryRunner.query(`ALTER TABLE \`intra_auth\` DROP COLUMN \`intra_id\``);
    // await queryRunner.query(`ALTER TABLE \`intra_auth\` ADD \`intra_id\` varchar(40) NOT NULL`);
    // await queryRunner.query(`CREATE INDEX \`ix_intra_id\` ON \`intra_auth\` (\`intra_id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`article\` DROP INDEX \`IDX_d78c76119c9eb32bfc02593991\``,
    );
    await queryRunner.query(`ALTER TABLE \`article\` DROP COLUMN \`slack_id\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8aa3228eec2d1c6361e95fd6f6\` ON \`slack\``,
    );
    await queryRunner.query(`DROP INDEX \`ix_deleted_at\` ON \`slack\``);
    await queryRunner.query(`DROP TABLE \`slack\``);
    // await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_77cda6c3364a4de9050c779535\` ON \`intra_auth\` (\`user_id\`)`);
  }
}
