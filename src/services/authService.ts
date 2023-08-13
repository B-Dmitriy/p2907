import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import { tokensService } from './tokensService';
import type { IPublicUserData, TRegistrationUserData } from '../models/authModels';

class AuthService {
    async me(id: string): Promise<IPublicUserData> {
        try {
            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE id = $1;`, id);

            if (!users.length) throw APIError.NotFound(`Me data not found`);

            const user: IPublicUserData = users[0];

            return {
                id: user.id,
                login: user.login,
                email: user.email,
                confirmed: user.confirmed,
                roles: user.roles,
            };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`[Database error] ${err}`);
        }
    }

    async login(login: string, password: string): Promise<IPublicUserData> {
        try {
            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE login = $1;`,
                login);

            if (!users.length) throw APIError.Conflict('Wrong login details');

            const user = users[0];

            if (!bcrypt.compareSync(password, user.password)) {
                throw APIError.Conflict("Wrong login details");
            };

            return {
                id: user.id,
                login: user.login,
                email: user.email,
                confirmed: user.confirmed,
                roles: user.roles
            };
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`[Database error] ${err}`);
        }

    }

    async logout(userId: string): Promise<void> {
        try {
            await tokensService.deleteRefreshToken(userId);
        } catch (err) {
            throw APIError.DatabaseError(`[Database error] ${err}`);
        }
    }

    async registration({ login, password, email, phone_number }: TRegistrationUserData): Promise<IPublicUserData> {
        try {
            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(password, salt);

            const users = await db.any(`
                SELECT * FROM todolist.users 
                WHERE login = $1 OR email = $2;`, [login, email]);

            if (users.length) throw APIError.Conflict(`User with login: ${login} or email: ${email} already existing`);

            const data = await db.any(`
                INSERT INTO todolist.users
                (login, password, email, phone)
                VALUES ($1, $2, $3, $4) 
                RETURNING *;`,
                [login, hashPassword, email, phone_number]);


            const newUser: IPublicUserData = data[0];

            return {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                confirmed: newUser.confirmed,
                roles: newUser.roles,
            }
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`[Database error] ${err}`);
        }
    }
}

export const authService = new AuthService();