import { APIError } from '../utils/APIError';
import { tokensService } from '../services/tokensService';
import type { Request, Response, NextFunction } from 'express';

export function authMiddleware (req: Request, _: Response, next: NextFunction): void {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw APIError.NotAuthorized();

        const data = tokensService.verifyAccessToken(token);

        if (!data) throw APIError.NotAuthorized();

        if (typeof data.id === 'number') {
            data.id = String(data.id);
        };

        Object.defineProperty(req, 'user', {
            value: data,
            writable: false
        });

        next();
    } catch (e) {
        next(e);
    }
}
