import jwt, { Secret } from 'jsonwebtoken';
import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import type { TJWVPayload, TRequestUser } from '../models/authModels';
import type {
    GenerateTokensResult,
    ISaveTokenResponse,
    IRefreshTokenResponse
} from '../models/tokensModels';

class TokensService {
    generateTokens(userData: TRequestUser): GenerateTokensResult {
        try {
            const accessToken = jwt.sign(
                {
                    id: userData.id,
                    roles: userData.roles,
                },
                process.env.JWT_ACCESS_SECRET as Secret,
                {
                    expiresIn: '30m'
                }
            );

            const refreshToken = jwt.sign(
                {
                    id: userData.id,
                    roles: userData.roles,
                },
                process.env.JWT_REFRESH_SECRET as Secret,
                {
                    expiresIn: '30d'
                }
            );

            return { accessToken, refreshToken };
        } catch (err) {
            throw APIError.DatabaseError(`Generate token error: ${err}`);
        }
    }

    verifyAccessToken(token: string): TJWVPayload | null {
        try {
            let userData: TJWVPayload = { id: '', roles: [] };

            jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET as Secret,
                (err, data) => {
                    if (err !== null) {
                        throw APIError.NotAuthorized(err.message);
                    } else {
                        userData = data as TJWVPayload
                    }
                });

            return userData;
        } catch (e) {
            return null;
        }
    }

    verifyRefreshToken(token: string): TJWVPayload | null {
        try {
            let userData: TJWVPayload = { id: '', roles: [] };

            jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET as Secret,
                (err, data) => {
                    if (err !== null) {
                        throw APIError.NotAuthorized(err.message);
                    } else {
                        userData = data as TJWVPayload
                    }
                });

            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: string, refreshToken: string): Promise<ISaveTokenResponse> {
        try {
            const tokens = await db.any(`
                SELECT * FROM todolist.tokens 
                WHERE user_id = $1;`,
                [userId]);

            if (!tokens.length) {
                await db.any(`
                    INSERT INTO todolist.tokens
                    (user_id, refresh_token)
                    VALUES ($1, $2);`,
                    [userId, refreshToken]);
            } else {
                await db.any(`
                    UPDATE todolist.tokens 
                    SET refresh_token = $1
                    WHERE user_id = $2;`,
                    [refreshToken, userId]);
            };

            return { userId, refreshToken };
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async refreshToken(oldRefreshToken: string): Promise<IRefreshTokenResponse> {
        console.log(oldRefreshToken);
        try {
            const userData = this.verifyRefreshToken(oldRefreshToken);

            if (!userData) throw APIError.NotAuthorized();

            const tokens = await db.any(`
                SELECT * FROM todolist.tokens 
                WHERE user_id = $1;`,
                [userData.id]);

            if (!tokens.length) throw APIError.NotAuthorized();

            const { accessToken, refreshToken } = this.generateTokens(userData);

            await db.any(`
                UPDATE todolist.tokens 
                SET refresh_token = $1
                WHERE user_id = $2;`,
                [refreshToken, userData.id]);

            return { userId: userData.id, accessToken, refreshToken };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        try {
            await db.any(`DELETE FROM todolist.tokens WHERE user_id = $1;`, userId);

            return Promise.resolve();
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }
}

export const tokensService = new TokensService();
