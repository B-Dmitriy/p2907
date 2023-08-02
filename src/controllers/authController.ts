import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { errorHandler } from './../utils/errorHandler';

class AuthController {
    async me(req: Request, res: Response) {
        try {
            const token = req.body.token;

            const user = await authService.me(token);

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

    async logout(req: Request, res: Response) {
        try {

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