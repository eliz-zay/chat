import * as express from 'express';
import { makeValidateBody } from 'express-class-validator';

import { UserService } from '../service';
import { SignUpRequest, SignInRequest } from '../schema';

export function getAuthController(userService: UserService): express.Router {
    const controller = express.Router();

    controller.post('/sign-up', makeValidateBody(SignUpRequest), async (req, res, next) => {
        try {
            const userData = await userService.signUp(req.body);

            return res.status(200).json(userData);
        } catch (err) {
            return next(err);
        }
    });

    controller.post('/sign-in', makeValidateBody(SignInRequest), async (req, res, next) => {
        try {
            const userData = await userService.signIn(req.body);

            return res.status(200).json(userData);
        } catch (err) {
            return next(err);
        }
    });

    controller.get('/health-check', async (req, res, next) => {
        console.log(req.headers);
        return res.status(200).json({});
    });

    return controller;
}
