import { TRequestUser, TJWVPayload } from '../models/authModels';
import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/APIError';
import { tokensService } from '../services/tokensService';

/** TODO: Перенести тип в модель User */
export interface RequestAuth extends Request {
    user?: TRequestUser;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return APIError.NotAuthorized();
        }

        const data = tokensService.verifyAccessToken(token);

        Object.defineProperty(req, 'user', {
            value: data,
            writable: false,
        });

        next();
    } catch (e) {
        next(e);
    }
}