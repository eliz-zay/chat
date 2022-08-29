import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';

import { initApp, InitAppParams } from './app';
import { initWsServer, InitWsServerParams } from './websocket';
import { getOnMessageHandler, onHttpUpgrade, OnHttpUpgradeParams } from './listener'
import { getDataSource } from './common';
import { UserService, MessageService, ChatService } from './service';
import { getAuthController, getChatController } from './controller';

async function bootstrapServer() {
    dotenv.config();

    const dataSource = getDataSource();
    
    await dataSource.initialize();

    const userService = new UserService();
    const messageService = new MessageService();
    const chatService = new ChatService();

    const initAppParams: InitAppParams = {
        '/auth': getAuthController(userService),
        '/chat': getChatController(userService, chatService),
    };

    const initWsServerParams: InitWsServerParams = {
        onMessage: getOnMessageHandler(messageService, chatService)
    };

    const app: express.Application = await initApp(initAppParams);

    const wsServer: WebSocketServer = await initWsServer(initWsServerParams);

    const server: http.Server = app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}\n`);
    });

    server.on('upgrade', onHttpUpgrade({ wsServer, userService }));
}

bootstrapServer();
