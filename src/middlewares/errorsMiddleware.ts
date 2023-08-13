import { APIError } from '../utils/APIError';
import type { Request, Response } from 'express';

export function errorsMiddleware(err: Error, _: Request, res: Response) {
    if (err instanceof APIError) {
        return res.status(err.status).send({
            message: err.message,
            errors: err.errors,
        });
    }
    return res.status(500).send({ message: "Server internal error" });
}