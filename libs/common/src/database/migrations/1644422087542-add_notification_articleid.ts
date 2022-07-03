import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNotificationArticleid1644422087542 implements MigrationInterface {
  name = 'addNotificationArticleid1644422087542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notification\` ADD \`article_id\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`article_id\``);
  }
}
