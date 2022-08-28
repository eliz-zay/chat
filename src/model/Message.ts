import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { User, Chat } from './';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chat, chat => chat.messages, { nullable: false })
    @JoinColumn({ name: 'chat_id' })
    chat: Chat;

    @Column({ name: 'chat_id', type: 'int', nullable: false })
    chatId: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column({ name: 'sender_id', type: 'int', nullable: false })
    senderId: number;

    @Column({ type: 'varchar', length: 1024, nullable: false })
    text: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;

    constructor(message: Partial<Message>) {
        Object.assign(this, message);
    }
}
