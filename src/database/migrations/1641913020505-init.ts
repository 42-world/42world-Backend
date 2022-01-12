import {MigrationInterface, QueryRunner} from "typeorm";

export class init1641913020505 implements MigrationInterface {
    name = 'init1641913020505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`authenticate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`intra_id\` varchar(40) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, INDEX \`ix_intra_id\` (\`intra_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`article_id\` int NOT NULL, \`writer_id\` int NOT NULL, INDEX \`ix_comment_article_id\` (\`article_id\`), INDEX \`ix_comment_writer_id\` (\`writer_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('NEW_COMMENT', 'FROM_ADMIN') NOT NULL DEFAULT 'FROM_ADMIN', \`content\` text NULL, \`time\` datetime NULL, \`is_read\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, INDEX \`ix_notification_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nickname\` varchar(20) NOT NULL, \`oauth_token\` varchar(255) NULL, \`is_authenticated\` tinyint NOT NULL DEFAULT 0, \`refresh_token\` varchar(255) NULL, \`role\` enum ('CADET', 'ADMIN') NOT NULL DEFAULT 'CADET', \`picture\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NULL, \`content\` varchar(255) NULL, \`view_count\` int NOT NULL DEFAULT '0', \`category_id\` int NOT NULL, \`writer_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`ix_article_title\` (\`title\`), INDEX \`ix_article_category_id\` (\`category_id\`), INDEX \`ix_article_writer_id\` (\`writer_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`ix_article_writer_id\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_article_category_id\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_article_title\` ON \`article\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`ix_notification_user_id\` ON \`notification\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP INDEX \`ix_comment_writer_id\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_comment_article_id\` ON \`comment\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_intra_id\` ON \`authenticate\``);
        await queryRunner.query(`DROP TABLE \`authenticate\``);
    }

}
