import { Chat } from '../model';
import { UserSchema, transformToUserSchema } from './';

export class ChatSchema {
    id: number;

    title?: string;

    isPrivate: boolean;
    
    users: UserSchema[];
}

export function transformToChatSchema(chat: Chat): ChatSchema {
    const { id, title, isPrivate, users } = chat;
    
    const userSchemas = users.map(u => transformToUserSchema(u));

    return { id, title, isPrivate, users: userSchemas };
}
