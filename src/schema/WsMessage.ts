import { MessageSchema } from './';

export enum WsMessageType {
    Message = 'Message',
    ApiError = 'ApiError',
    InternalError = 'InternalError'
}

export class WsMessageSchema {
    type: WsMessageType;

    messageData?: MessageSchema;

    errorData?: ErrorSchema;

    constructor(partial: Partial<WsMessageSchema>) {
        Object.assign(this, partial);
    }
}

export class ErrorSchema {
    text: string;
}

export class AddMessageWsSchema {
    chatId: number;

    text: string;
}

export function transformMessageToWsSchema(message: MessageSchema): WsMessageSchema {
    const { id, text, chatId, senderId, createdAt } = message;

    return {
        type: WsMessageType.Message,
        messageData: { id, text, chatId, senderId, createdAt }
    };
}

export function transformErrorToWsSchema(type: WsMessageType, text: string): WsMessageSchema {
    return { type, errorData: { text } };
}
