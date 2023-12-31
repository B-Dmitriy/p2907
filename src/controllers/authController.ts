import { APIError } from '../utils/APIError';
import { authService } from '../services/authService';
import { tokensService } from '../services/tokensService';
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_MAX_AGE } from '../config/constants';
import type { NextFunction, Response, Request } from 'express';
import type { TRegistrationRequest, TLoginRequest, TActivateRequest } from '../models/authModels';

class AuthController {
    async me (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user.id;

            if (!id) throw APIError.NotAuthorized();

            const data = await authService.me(id);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async login (req: TLoginRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { login, password } = req.body;

            const user = await authService.login(login, password);

            const { accessToken, refreshToken } = tokensService.generateTokens(user);

            await tokensService.saveToken(user.id, refreshToken);

            res
                .cookie(REFRESH_TOKEN_KEY, refreshToken, { maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async logout (req: TLoginRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user.id;

            if (!id) throw APIError.NotAuthorized();

            await authService.logout(id);

            res
                .clearCookie(REFRESH_TOKEN_KEY)
                .status(204).send();
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async registration (req: TRegistrationRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;

            const user = await authService.registration(userData);

            if (!user) throw APIError.NotFound(`User ${userData.login} not found`);

            const { accessToken, refreshToken } = tokensService.generateTokens(user);

            await tokensService.saveToken(user.id, refreshToken);

            res
                .status(201)
                .cookie(REFRESH_TOKEN_KEY, refreshToken, { maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async refresh (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;

            const { userId, accessToken, refreshToken: newRefreshToken } = await tokensService.refreshToken(refreshToken);

            const user = authService.me(userId);

            res
                .status(201)
                .cookie(REFRESH_TOKEN_KEY, newRefreshToken, { maxAge: REFRESH_TOKEN_MAX_AGE, httpOnly: true })
                .send({ user, accessToken });
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async activate (req: TActivateRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { link } = req.params;

            if (!link) throw APIError.BadRequest('User link is required', []);

            await authService.activate(link);

            res
                .status(301)
                .redirect(process.env.MAIL_REDIRECT);
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const authController = new AuthController();
