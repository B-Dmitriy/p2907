import { NextFunction, Response } from 'express';
import { RequestAuth } from '../middlewares/authMiddleware';
import { authService } from '../services/authService';
import { TRegistrationRequest, TLoginRequest } from '../models/authModels';
import { tokensService } from '../services/tokensService';
import { APIError } from '../utils/APIError';

class AuthController {
    async me(req: RequestAuth, res: Response, next: NextFunction) {
        try {
            const id = req.user?.id || '';

            const data = await authService.me(id);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async login(req: TLoginRequest, res: Response, next: NextFunction) {
        try {
            const { login, password } = req.body;

            const user = await authService.login(login, password);

            const { accessToken, refreshToken } = await tokensService.generateTokens({
                id: user.id,
                roles: user.roles,
            });

            await tokensService.saveToken(user.id, refreshToken);

            res
                .cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async registration(req: TRegistrationRequest, res: Response, next: NextFunction) {
        try {
            const userData = req.body;

            const user = await authService.registration(userData);

            if (!user) throw APIError.NotFound(`User ${userData.login} not found`);

            const { accessToken, refreshToken } = await tokensService.generateTokens({
                id: user.id,
                roles: user.roles,
            });

            await tokensService.saveToken(user.id, refreshToken);

            res
                .status(201)
                .cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const authController = new AuthController();