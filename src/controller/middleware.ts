import * as express from 'express';

import { ApiError, JwtPayload } from '../common';
import { UserService } from '../service';

export function getAuthMiddleware(userService: UserService) {
    return async (req: express.Request & { auth: JwtPayload }, res, next) => {
        try {
            const jwtPayload: JwtPayload = req.auth;

            if (!jwtPayload) {
                throw new ApiError('Authorization required');
            }

            await userService.getUserInfo(jwtPayload);

            return next();
        } catch (err) {
            return next(err);
        }
    }
}
