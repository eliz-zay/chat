import { Message } from '../model';

export class MessageSchema {
    id: number;

    chatId: number;

    senderId: number;

    text: string;
    
    createdAt: Date;
}

export function transformToMessageSchema(message: Message): MessageSchema {
    const { id, chatId, senderId, text, createdAt } = message;

    return { id, chatId, senderId, text, createdAt };
}
