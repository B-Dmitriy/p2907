import jwt from 'jsonwebtoken';
import { IRequestUser } from '../models/authModel';
import { Request, Response, NextFunction } from 'express';

export interface RequestAuth extends Request {
    user?: IRequestUser;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).send({})
        }

        const user = jwt.verify(token, 'secret');

        Object.defineProperty(req, 'user', {
            value: user,
            writable: false,
        });

        next();
    } catch (e) {
        return res.status(403).send({});
    }
}