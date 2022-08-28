import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMessageChat1661601784422 implements MigrationInterface {
    name = 'UserMessageChat1661601784422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "c_user" ("id" SERIAL NOT NULL, "username" character varying(64) NOT NULL, "salt" character varying(64) NOT NULL, "pass_hash" character varying(1024) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1db33f44ba865e8d518eb433bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "c_chat" ("id" SERIAL NOT NULL, "title" character varying(20), "is_private" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_05018d5c09eeae5c627bcf4c0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "c_message" ("id" SERIAL NOT NULL, "text" character varying(1024) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "chat_id" integer NOT NULL, "sender_id" integer NOT NULL, CONSTRAINT "PK_6e7946129ec323dfea8b4c9b969" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "c_user_chats_chat" ("user_id" integer NOT NULL, "chat_id" integer NOT NULL, CONSTRAINT "PK_75923c3ebb40d8d4cde526686b0" PRIMARY KEY ("user_id", "chat_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_920ff213211b019d1eeeaee57c" ON "c_user_chats_chat" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_51cafd76e51e0b4b952ac5c578" ON "c_user_chats_chat" ("chat_id") `);
        await queryRunner.query(`ALTER TABLE "c_message" ADD CONSTRAINT "FK_f6cae60689d211067f417768d90" FOREIGN KEY ("chat_id") REFERENCES "c_chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_message" ADD CONSTRAINT "FK_9368b9e4b3dccef9c60cc1b3ff2" FOREIGN KEY ("sender_id") REFERENCES "c_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" ADD CONSTRAINT "FK_920ff213211b019d1eeeaee57c8" FOREIGN KEY ("user_id") REFERENCES "c_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" ADD CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c" FOREIGN KEY ("chat_id") REFERENCES "c_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" DROP CONSTRAINT "FK_51cafd76e51e0b4b952ac5c578c"`);
        await queryRunner.query(`ALTER TABLE "c_user_chats_chat" DROP CONSTRAINT "FK_920ff213211b019d1eeeaee57c8"`);
        await queryRunner.query(`ALTER TABLE "c_message" DROP CONSTRAINT "FK_9368b9e4b3dccef9c60cc1b3ff2"`);
        await queryRunner.query(`ALTER TABLE "c_message" DROP CONSTRAINT "FK_f6cae60689d211067f417768d90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51cafd76e51e0b4b952ac5c578"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_920ff213211b019d1eeeaee57c"`);
        await queryRunner.query(`DROP TABLE "c_user_chats_chat"`);
        await queryRunner.query(`DROP TABLE "c_message"`);
        await queryRunner.query(`DROP TABLE "c_chat"`);
        await queryRunner.query(`DROP TABLE "c_user"`);
    }

}
