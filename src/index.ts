import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';

import { initApp } from './app';
import { initWsServer } from './websocket';
import { onHttpUpgrade } from './listener'
import { getDataSource } from './common/db';
import { UserService, MessageService, ChatService } from './service';

async function bootstrapServer() {
    dotenv.config();

    const dataSource = getDataSource();
    
    await dataSource.initialize();

    const userService = new UserService();
    const messageService = new MessageService();
    const chatService = new ChatService();

    const app: express.Application = await initApp(userService, chatService);
    const wsServer: WebSocketServer = await initWsServer(messageService, chatService);

    const server: http.Server = app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}\n`);
    });

    server.on('upgrade', onHttpUpgrade(wsServer));
}

bootstrapServer();
