import * as express from 'express';
import { makeValidateBody } from 'express-class-validator';

import { transformAndValidate, JwtPayload } from '../common';
import { AddPrivateChatRequest, ChatHistoryRequest, ChatSchema, MessageSchema } from '../schema';
import { UserService, ChatService } from '../service';
import { getAuthMiddleware } from './middleware';

export function getChatController(userService: UserService, chatService: ChatService) {
    const controller = express.Router();

    const checkIfUserAuthorized = getAuthMiddleware(userService);

    controller.post('/add-private-chat',
        checkIfUserAuthorized,
        makeValidateBody(AddPrivateChatRequest),
        async (req: express.Request & { auth: JwtPayload }, res, next) => {
            try {
                const chat: ChatSchema = await chatService.addPrivateChat(req.auth, req.body);

                return res.status(200).json({ chat });
            } catch (err) {
                return next(err);
            }
        }
    );

    controller.get('/', checkIfUserAuthorized, async (req: express.Request & { auth: JwtPayload }, res, next) => {
        try {
            const chatQuery = await transformAndValidate(ChatHistoryRequest, req.query);

            const messages: MessageSchema[] = await chatService.getChatHistory(req.auth, chatQuery);

            return res.status(200).json({ messages: messages });
        } catch (err) {
            return next(err);
        }
    });

    return controller;
}
