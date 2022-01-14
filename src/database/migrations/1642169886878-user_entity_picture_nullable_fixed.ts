import {MigrationInterface, QueryRunner} from "typeorm";

export class userEntityPictureNullableFixed1642169886878 implements MigrationInterface {
    name = 'userEntityPictureNullableFixed1642169886878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`picture\` \`picture\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`picture\` \`picture\` varchar(255) NOT NULL`);
    }

}
