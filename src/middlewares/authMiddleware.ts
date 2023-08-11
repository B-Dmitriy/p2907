import { TRequestUser, TJWVPayload } from '../models/authModels';
import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/APIError';
import { tokensService } from '../services/tokensService';

export interface RequestAuth extends Request {
    user?: TRequestUser;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return APIError.NotAuthorized();
        }

        tokensService.verifyToken(token);

        Object.defineProperty(req, 'user', {
            value: {
                // id: user.id,
                // roles: user.roles,
            },
            writable: false,
        });

        next();
    } catch (e) {
        next(e);
    }
}