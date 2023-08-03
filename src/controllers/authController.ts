import { Request, Response } from 'express';
import { RequestAuth } from '../middlewares/authMiddleware';
import { authService } from '../services/authService';
import { errorHandler } from '../utils/errorHandler';

class AuthController {
    async me(req: RequestAuth, res: Response) {
        try {
            const id = req.user?.id || '';

            const user = await authService.me(id);

            res.send(user);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { login, password } = req.body;

            const user = await authService.login(login, password);

            res.send(user);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async registration(req: Request, res: Response) {
        try {
            const userData = req.body;

            const user = await authService.registration(userData);

            res.send(user);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }
}

export const authController = new AuthController();