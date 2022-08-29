import * as express from 'express';
import { WebSocketServer } from 'ws';

import { verifyToken, JwtPayload } from '../common';
import { UserService } from '../service';

export interface OnHttpUpgradeParams {
    wsServer: WebSocketServer;
    userService: UserService;
};

export function onHttpUpgrade({ wsServer, userService }: OnHttpUpgradeParams) {
    return async (request: express.Request & { auth: JwtPayload }, socket, head) => {
        try {
            const token = request.headers.authorization?.split('Bearer ')[1];

            const jwtPayload: JwtPayload = await verifyToken(token);

            request.auth = jwtPayload;

            await userService.getUserInfo(jwtPayload);
        
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
