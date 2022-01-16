import {MigrationInterface, QueryRunner} from "typeorm";

export class entityTimeColumnRemoved1642077931215 implements MigrationInterface {
    name = 'entityTimeColumnRemoved1642077931215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`ix_comment_article_id\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_comment_writer_id\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_notification_user_id\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`ix_article_title\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_article_category_id\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_article_writer_id\` ON \`article\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`time\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`content\` \`content\` text NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`ix_user_id\` ON \`authenticate\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_article_id\` ON \`comment\` (\`article_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_writer_id\` ON \`comment\` (\`writer_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_user_id\` ON \`notification\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_title\` ON \`article\` (\`title\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_category_id\` ON \`article\` (\`category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_writer_id\` ON \`article\` (\`writer_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`ix_writer_id\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_category_id\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_title\` ON \`article\``);
        await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`ix_writer_id\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_article_id\` ON \`comment\``);
        await queryRunner.query(`DROP INDEX \`ix_user_id\` ON \`authenticate\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`content\` \`content\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`time\` datetime NULL`);
        await queryRunner.query(`CREATE INDEX \`ix_article_writer_id\` ON \`article\` (\`writer_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_article_category_id\` ON \`article\` (\`category_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_article_title\` ON \`article\` (\`title\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_notification_user_id\` ON \`notification\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_comment_writer_id\` ON \`comment\` (\`writer_id\`)`);
        await queryRunner.query(`CREATE INDEX \`ix_comment_article_id\` ON \`comment\` (\`article_id\`)`);
    }

}
