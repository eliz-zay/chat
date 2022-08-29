import * as express from 'express';
import * as bodyParser from 'body-parser';
import { expressjwt } from 'express-jwt';

import { ApiError } from './common';

export interface InitAppParams {
    [route: string]: express.Router;
}

export async function initApp(controllers: InitAppParams): Promise<express.Application> {
    const app = express();

    app.use(bodyParser.json());
    app.use(expressjwt({ secret: process.env.JWT_SECRET, credentialsRequired: false, algorithms: ['HS256'] }));

    Object.entries(controllers).forEach(([route, controller]) => {
        app.use(route, controller);
    });

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
