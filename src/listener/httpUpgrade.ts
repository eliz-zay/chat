import * as express from 'express';
import { WebSocketServer } from 'ws';

import { verifyToken } from '../common/crypt';
import { JwtPayload } from '../schema';

export function onHttpUpgrade(wsServer: WebSocketServer) {
    return async (request: express.Request & { auth: JwtPayload }, socket, head) => {
        try {
            const token = request.headers.authorization?.split('Bearer ')[1];

            const payload: JwtPayload = await verifyToken(token);

            request.auth = payload;

        } catch (err) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();

            return;
        }
    
        wsServer.handleUpgrade(request, socket, head, (socket, request) => {
            wsServer.emit('connection', socket, request);
        });
    }
}
