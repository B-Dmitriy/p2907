import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { APIError } from '../utils/APIError';

export function errorsMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof APIError) {
        return res.status(err.status).send({
            message: err.message,
            errors: err.errors,
        });
    }
    return res.status(500).send({ message: "Server internal error" });
}