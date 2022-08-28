import * as express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

import { JwtPayload } from './schema';
import { SocketEventHandler } from './listener';
import { ChatService, MessageService } from './service';

export async function initWsServer(
    messageService: MessageService,
    chatService: ChatService
): Promise<WebSocketServer> {
    const wsServer = new WebSocketServer({
        noServer: true,
        path: '/chat',
        clientTracking: true,
    });

    const clients: Map<number, WebSocket> = new Map();

    wsServer.on('connection', connectionHandler(clients, { messageService, chatService }));

    return wsServer;
}

function connectionHandler(clients: Map<number, WebSocket>, { messageService, chatService }) {
    return (socket: WebSocket, request: express.Request & { auth: JwtPayload }) => {
        const jwtPayload: JwtPayload = request.auth;

        clients.set(jwtPayload.id, socket);

        const socketEventHandler = new SocketEventHandler(
            clients,
            socket,
            jwtPayload,
            { messageService, chatService }
        );

        socket.on('message', socketEventHandler.onMessage());
    }
}
