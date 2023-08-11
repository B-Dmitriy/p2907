import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import { TJWVPayload } from '../models/authModels';

class TokensService {
    generateTokens(userData: { id: string, roles: number[] }) {
        try {
            const accessToken = jwt.sign(userData, 'access-secret', {
                expiresIn: '30m' // время жизни токена 
            });

            const refreshToken = jwt.sign(userData, 'refresh-secret', {
                expiresIn: '30d' // время жизни токена 
            });

            return { accessToken, refreshToken };
        } catch (err) {
            throw APIError.DatabaseError(`Generate token error: ${err}`);
        }
    }

    async saveToken(userId: string, refreshToken: string): Promise<any> {
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
    verifyAccessToken(token: string) {
        try {
            let userData;
            jwt.verify(token, 'access-secret', (err, data) => {
                if (err !== null) {
                    throw APIError.NotAuthorized(err.message);
                } else {
                    userData = data
                }
            });
            return userData;
        } catch (e) {
            return null;
        }
    }

    async deleteRefreshToken(userId: string) {
        try {
            await db.any(`DELETE FROM todolist.tokens WHERE user_id = $1;`, userId);
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }
}

export const tokensService = new TokensService();