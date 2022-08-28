import * as express from 'express';
import { makeValidateBody } from 'express-class-validator';

import { transformAndValidate } from '../common/validation';
import { AddPrivateChatRequest, ChatHistoryRequest, ChatSchema, MessageSchema } from '../schema';
import { JwtPayload } from '../schema';
import { ChatService } from '../service/ChatService';

export function getChatController(chatService: ChatService) {
    const controller = express.Router();

    controller.post('/add-private-chat', makeValidateBody(AddPrivateChatRequest), async (req: express.Request & { auth: JwtPayload }, res, next) => {
        try {
            const chat: ChatSchema = await chatService.addPrivateChat(req.auth, req.body);

            return res.status(200).json({ chat });
        } catch (err) {
            return next(err);
        }
    })

    controller.get('/', async (req: express.Request & { auth: JwtPayload }, res, next) => {
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
