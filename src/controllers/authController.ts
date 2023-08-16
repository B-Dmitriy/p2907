import { APIError } from '../utils/APIError';
import { authService } from '../services/authService';
import { tokensService } from '../services/tokensService';
import type { NextFunction, Response, Request } from 'express';
import type { TRegistrationRequest, TLoginRequest } from '../models/authModels';

class AuthController {
    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.user.id;

            if (!id) throw APIError.NotAuthorized();

            const data = await authService.me(id as string);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async login(req: TLoginRequest, res: Response, next: NextFunction) {
        try {
            const { login, password } = req.body;

            const user = await authService.login(login, password);

            const { accessToken, refreshToken } = tokensService.generateTokens(user);

            await tokensService.saveToken(user.id, refreshToken);

            res
                .cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async logout(req: TLoginRequest, res: Response, next: NextFunction) {
        try {
            const id = req.user.id;

            if (!id) throw APIError.NotAuthorized();

            await tokensService.deleteRefreshToken(id);

            res
                .clearCookie('refreshToken')
                .status(204).send();
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async registration(req: TRegistrationRequest, res: Response, next: NextFunction) {
        try {
            const userData = req.body;

            const user = await authService.registration(userData);

            if (!user) throw APIError.NotFound(`User ${userData.login} not found`);

            const { accessToken, refreshToken } = tokensService.generateTokens(user);

            await tokensService.saveToken(user.id, refreshToken);

            res
                .status(201)
                .cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async refresh(req: any, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            const { userId, accessToken, refreshToken: newRefreshToken } = await tokensService.refreshToken(refreshToken);

            const user = authService.me(userId);

            res
                .status(201)
                .cookie('refreshToken', newRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const authController = new AuthController();
