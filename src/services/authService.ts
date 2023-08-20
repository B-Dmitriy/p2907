import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import { tokensService } from './tokensService';
import type { IPublicUserData, TRegistrationUserData } from '../models/authModels';
import { mailService } from './mailService';

class AuthService {
    async me (id: string): Promise<IPublicUserData> {
        try {
            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE id = $1;`, id);

            if (users.length === 0) throw APIError.NotFound('Me data not found');

            const user = users[0];

            return {
                id: user.id,
                login: user.login,
                email: user.email,
                confirmed: user.confirmed,
                roles: user.roles,
                userLink: user.user_link
            };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError();
        }
    }

    async login (login: string, password: string): Promise<IPublicUserData> {
        try {
            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE login = $1;`,
            login);

            if (users.length === 0) throw APIError.Conflict('Wrong login details');

            const user = users[0];

            if (!bcrypt.compareSync(password, user.password)) {
                throw APIError.Conflict('Wrong login details');
            }
            ;

            return {
                id: user.id,
                login: user.login,
                email: user.email,
                confirmed: user.confirmed,
                roles: user.roles,
                userLink: user.user_link
            };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError();
        }
    }

    async logout (userId: string): Promise<void> {
        try {
            await tokensService.deleteRefreshToken(userId);
        } catch (err) {
            throw APIError.DatabaseError();
        }
    }

    async registration ({ login, password, email, phoneNumber }: TRegistrationUserData): Promise<IPublicUserData> {
        try {
            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(password, salt);
            const userLink = v4();

            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE login = $1 OR email = $2;`, [login, email]);

            if (users.length > 0) throw APIError.Conflict(`User with login: ${login} or email: ${email} already existing`);

            const data = await db.any(`
                INSERT INTO todolist.users
                (login, password, email, phone, user_link)
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *;`,
            [login, hashPassword, email, phoneNumber, userLink]);

            const newUser = data[0];

            await mailService.sendActivateMail(newUser.email, userLink);

            return {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                confirmed: newUser.confirmed,
                roles: newUser.roles,
                userLink: newUser.user_link
            };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError();
        }
    }

    async activate (activateLink: string): Promise<void> {
        try {
            await db.any(`
                UPDATE todolist.users 
                SET confirmed = TRUE
                WHERE user_link = $1
                RETURNING *;`,
            activateLink);
        } catch (err) {
            throw APIError.DatabaseError();
        }
    }
}

export const authService = new AuthService();
