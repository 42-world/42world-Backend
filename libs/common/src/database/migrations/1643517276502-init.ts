import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1643517276502 implements MigrationInterface {
  name = 'init1643517276502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ft_auth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`intra_id\` varchar(40) NOT NULL, \`user_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_intra_id\` (\`intra_id\`), INDEX \`ix_user_id\` (\`user_id\`), UNIQUE INDEX \`IDX_77cda6c3364a4de9050c779535\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reaction_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`type\` enum ('LIKE') NOT NULL DEFAULT 'LIKE', \`comment_id\` int NOT NULL, \`article_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_user_id\` (\`user_id\`), INDEX \`ix_comment_id\` (\`comment_id\`), INDEX \`ix_article_id\` (\`article_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`like_count\` int NOT NULL DEFAULT '0', \`article_id\` int NOT NULL, \`writer_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`ix_article_id\` (\`article_id\`), INDEX \`ix_writer_id\` (\`writer_id\`), INDEX \`ix_deleted_at\` (\`deleted_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('NEW_COMMENT', 'FROM_ADMIN') NOT NULL DEFAULT 'FROM_ADMIN', \`content\` text NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT 0, \`user_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reaction_article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`type\` enum ('LIKE') NOT NULL DEFAULT 'LIKE', \`article_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_user_id\` (\`user_id\`), INDEX \`ix_article_id\` (\`article_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nickname\` varchar(20) NOT NULL, \`oauth_token\` varchar(255) NOT NULL, \`last_login\` datetime NULL, \`role\` enum ('CADET', 'ADMIN', 'NOVICE') NOT NULL DEFAULT 'NOVICE', \`character\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`ix_deleted_at\` (\`deleted_at\`), UNIQUE INDEX \`IDX_e2364281027b926b879fa2fa1e\` (\`nickname\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`ix_deleted_at\` (\`deleted_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`best\` (\`id\` int NOT NULL AUTO_INCREMENT, \`article_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_article_id\` (\`article_id\`), UNIQUE INDEX \`IDX_e90d3fc972b9b3c78cbfa44d74\` (\`article_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(42) NOT NULL, \`content\` text NOT NULL, \`view_count\` int NOT NULL DEFAULT '0', \`category_id\` int NOT NULL, \`writer_id\` int NOT NULL, \`comment_count\` int NOT NULL DEFAULT '0', \`like_count\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`ix_title\` (\`title\`), INDEX \`ix_category_id\` (\`category_id\`), INDEX \`ix_writer_id\` (\`writer_id\`), INDEX \`ix_deleted_at\` (\`deleted_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(`INSERT INTO \`category\` (name) VALUES ('자유게시판')`);

    await queryRunner.query(`INSERT INTO \`category\` (name) VALUES ('익명게시판')`);

    await queryRunner.query(`INSERT INTO \`category\` (name) VALUES ('42born2code 공지')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`ix_deleted_at\` ON \`article\``);
    await queryRunner.query(`DROP INDEX \`ix_writer_id\` ON \`article\``);
    await queryRunner.query(`DROP INDEX \`ix_category_id\` ON \`article\``);
    await queryRunner.query(`DROP INDEX \`ix_title\` ON \`article\``);
    await queryRunner.query(`DROP TABLE \`article\``);
    await queryRunner.query(`DROP INDEX \`IDX_e90d3fc972b9b3c78cbfa44d74\` ON \`best\``);
    await queryRunner.query(`DROP INDEX \`ix_article_id\` ON \`best\``);
    await queryRunner.query(`DROP TABLE \`best\``);
    await queryRunner.query(`DROP INDEX \`ix_deleted_at\` ON \`category\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP INDEX \`IDX_e2364281027b926b879fa2fa1e\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`ix_deleted_at\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`ix_article_id\` ON \`reaction_article\``);
    await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`reaction_article\``);
    await queryRunner.query(`DROP TABLE \`reaction_article\``);
    await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`notification\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
    await queryRunner.query(`DROP INDEX \`ix_deleted_at\` ON \`comment\``);
    await queryRunner.query(`DROP INDEX \`ix_writer_id\` ON \`comment\``);
    await queryRunner.query(`DROP INDEX \`ix_article_id\` ON \`comment\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP INDEX \`ix_article_id\` ON \`reaction_comment\``);
    await queryRunner.query(`DROP INDEX \`ix_comment_id\` ON \`reaction_comment\``);
    await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`reaction_comment\``);
    await queryRunner.query(`DROP TABLE \`reaction_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_77cda6c3364a4de9050c779535\` ON \`ft_auth\``);
    await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`ft_auth\``);
    await queryRunner.query(`DROP INDEX \`ix_intra_id\` ON \`ft_auth\``);
    await queryRunner.query(`DROP TABLE \`ft_auth\``);
  }
}
