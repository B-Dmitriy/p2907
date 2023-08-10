import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { RequestAuth } from '../middlewares/authMiddleware';
import { authService } from '../services/authService';
import { TRegistrationRequest } from '../models/authModels';

class AuthController {
    async me(req: RequestAuth, res: Response, next: NextFunction) {
        try {
            const id = req.user?.id || '';

            const user = await authService.me(id);

            res.send(user);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { login, password } = req.body;

            const user = await authService.login(login, password);

            res.send(user);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async registration(req: TRegistrationRequest, res: Response, next: NextFunction) {
        try {
            const userData = req.body;

            const user = await authService.registration(userData);


            const accessToken = jwt.sign({
                data: { id: user.id },
            }, 'access-secret', {
                expiresIn: '30m' // время жизни токена 
            });

            const refreshToken = jwt.sign({
                data: { id: user.id },
            }, 'refresh-secret', {
                expiresIn: '30d' // время жизни токена 
            });

            res.send({ user, accessToken, refreshToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const authController = new AuthController();