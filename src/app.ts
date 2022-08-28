import * as express from 'express';
import * as bodyParser from 'body-parser';
import { expressjwt } from 'express-jwt';

import { ApiError } from './common/ApiError';
import { getAuthController, getChatController } from './controller';
import { UserService, ChatService } from './service';

export async function initApp(
    userService: UserService,
    chatService: ChatService
): Promise<express.Application> {
    const app = express();

    app.use(bodyParser.json());
    app.use(expressjwt({ secret: process.env.JWT_SECRET, credentialsRequired: false, algorithms: ['HS256'] }));

    app.use('/auth', getAuthController(userService));
    app.use('/chat', getChatController(chatService));

    app.use((err, req, res, next) => {
        if (err instanceof ApiError) {
            return res.status(400).send(err);
        } else {
            console.log(err);
            res.status(500).send('Internal error');
        }
    });

    return app;
}
