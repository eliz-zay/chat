import * as express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

import { JwtPayload } from './common';
import { OnMessageParams } from './listener';

export interface InitWsServerParams {
    onMessage: (params: OnMessageParams) => void;
};

export async function initWsServer({ onMessage }: InitWsServerParams): Promise<WebSocketServer> {
    const wsServer = new WebSocketServer({
        noServer: true,
        path: '/chat',
    });

    const clients: Map<number, WebSocket> = new Map();

    wsServer.on('connection', (socket: WebSocket, request: express.Request & { auth: JwtPayload }) => {
        const jwtPayload: JwtPayload = request.auth;

        clients.set(jwtPayload.id, socket);

        socket.on('message', (strMessage: string) => onMessage({
            strMessage,
            clients,
            socket,
            jwtPayload
        }));
    });

    return wsServer;
}
