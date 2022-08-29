import { WebSocket } from 'ws';

import { JwtPayload, ApiError, transformAndValidate } from '../common';
import {
    WsMessageType,
    AddMessageWsSchema,
    transformMessageToWsSchema,
    transformErrorToWsSchema
} from '../schema';
import { ChatService, MessageService } from '../service';

export interface OnMessageParams {
    strMessage: string;
    clients: Map<number, WebSocket>;
    socket: WebSocket;
    jwtPayload: JwtPayload;
};

export function getOnMessageHandler(messageService: MessageService, chatService: ChatService) {
    return async ({ strMessage, clients, socket, jwtPayload }: OnMessageParams) => {
        try {
            const payload: AddMessageWsSchema = await transformAndValidate(
                AddMessageWsSchema,
                <Object> JSON.parse(strMessage)
            );

            const message = await messageService.addMessage(jwtPayload, payload);
            const chatUsers = await chatService.getChatUsers(message.chatId);

            const messageString = JSON.stringify(transformMessageToWsSchema(message));

            chatUsers.forEach(({ id: userId }) => {
                if (clients.has(userId)) {
                    clients.get(userId).send(messageString);
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

            socket.send(JSON.stringify(wsMessage));
        }
    }
}
