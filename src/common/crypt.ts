import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from './';

export function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

export async function generateHash(payload: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            payload, salt, 1000, 512, 'sha1',
            (err, hashBuffer) => err ? reject(err) : resolve(hashBuffer.toString('hex'))
        );
    })
}

export function generateToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            (err, token) => err ? reject(err) : resolve(token)
        );
    });
}

export function verifyToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, payload: JwtPayload) => err ? reject(err) : resolve(payload)
        );
    });
}
