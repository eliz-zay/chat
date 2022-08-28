import { WebSocket } from 'ws';

import { ApiError } from '../common/ApiError';
import { transformAndValidate } from '../common/validation';
import {
    JwtPayload,
    WsMessageType,
    AddMessageWsSchema,
    transformMessageToWsSchema,
    transformErrorToWsSchema
} from '../schema';
import { ChatService, MessageService } from '../service';

export class SocketEventHandler {
    private clients: Map<number, WebSocket>;
    private socket: WebSocket;
    private jwtPayload: JwtPayload;
    private messageService: MessageService;
    private chatService: ChatService;

    constructor(
        clients: Map<number, WebSocket>,
        socket: WebSocket,
        jwtPayload: JwtPayload,
        { messageService, chatService }
    ) {
        this.clients = clients;
        this.socket = socket;
        this.jwtPayload = jwtPayload;

        this.messageService = messageService;
        this.chatService = chatService;
    }

    public onMessage() {
        return async (strMessage: string) => {
            try {
                const payload: AddMessageWsSchema = await transformAndValidate(
                    AddMessageWsSchema,
                    <Object> JSON.parse(strMessage)
                );
    
                const message = await this.messageService.addMessage(this.jwtPayload, payload);
                const chatUsers = await this.chatService.getChatUsers(message.chatId);

                const messageString = JSON.stringify(transformMessageToWsSchema(message));

                chatUsers.forEach(({ id: userId }) => {
                    if (this.clients.has(userId)) {
                        this.clients.get(userId).send(messageString);
                    }
                });
                
            } catch (err) {
                const isApiError = err instanceof ApiError;

                if (!isApiError) {
                    console.error(err);
                }
    
                const type = isApiError ? WsMessageType.ApiError : WsMessageType.InternalError;
                const text = isApiError ? err.message : null;
    
                const wsMessage = transformErrorToWsSchema(type, text);
    
                this.socket.send(JSON.stringify(wsMessage));
            }
        }
    }
}
