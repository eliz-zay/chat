import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    OneToMany
} from 'typeorm';
import { User, Message } from './';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    title?: string;

    @Column({ name: 'is_private', type: 'boolean', default: true, nullable: false })
    isPrivate: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;

    @ManyToMany(() => User, user => user.chats)
    users: User[];

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    constructor(chat: Partial<Chat>) {
        Object.assign(this, chat);
    }
}
