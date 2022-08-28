import { MigrationInterface, QueryRunner } from "typeorm";

export class Chat1661682572338 implements MigrationInterface {
    name = 'Chat1661682572338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" DROP CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c"`);
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" ADD CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c" FOREIGN KEY ("chat_id") REFERENCES "c_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" DROP CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c"`);
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" ADD CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c" FOREIGN KEY ("chat_id") REFERENCES "c_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
