import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Chat } from './Chat';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 64, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 64, nullable: false })
    salt: string;

    @Column({ name: 'pass_hash', type: 'varchar', length: 1024, nullable: false })
    passwordHash: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;

    @ManyToMany(() => Chat, chat => chat.users)
    @JoinTable({
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'chat_id', referencedColumnName: 'id' }
    })
    chats: Chat[];

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
