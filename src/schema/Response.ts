import { MessageSchema, ChatSchema } from './';

export class LoggedInResponse {
    id: number;
    
    token: string;
}

export class ChatHistoryResponse {
    messages: MessageSchema[];
}

export class AddPrivateChatResponse {
    chat: ChatSchema;
}
