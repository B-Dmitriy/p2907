import { APIError } from '../utils/APIError';
import { tokensService } from '../services/tokensService';
import type { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return next(APIError.NotAuthorized());

        const data = tokensService.verifyAccessToken(token);

        if (!data) return next(APIError.NotAuthorized());

        Object.defineProperty(req, 'user', {
            value: data,
            writable: false,
        });

        next();
    } catch (e) {
        next(e);
    }
}