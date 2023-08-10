import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { errorHandler } from '../utils/errorHandler';
import { IPublicUserData, TRegistrationUserData } from '../models/authModels';
import { APIError } from '../utils/APIError';

class AuthService {
    async me(id: string) {
        try {
            const users = await db.any("SELECT * FROM users WHERE id = $1;", id);

            if (!users.length) throw "Oshibka dostupa";

            const user = users[0];

            return {
                id: user.id,
                login: user.login,
                email: user.email,
            };
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async login(login: string, password: string): Promise<any | Error> {

        try {
            const users = await db.any("SELECT * FROM users WHERE login = $1;", login);

            if (!users.length) throw "User with login: " + login + " not found";

            if (!bcrypt.compareSync(password, users[0].password)) {
                throw "Wrong password!";
            };

            const user = users[0];

            const token = jwt.sign({
                data: {
                    id: user.id,
                    role: user.role,
                },
            }, 'secret', {
                // expiresIn: '30m' // время жизни токена 
            });

            return {
                id: user.id,
                login: user.login,
                email: user.email,
                token,
            };
        } catch (err) {
            return errorHandler.databaseError(err);
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

            const newUser = await db.any(`
                INSERT INTO todolist.users
                (login, password, email, phone)
                VALUES ($1, $2, $3, $4) 
                RETURNING *;`,
                [login, hashPassword, email, phone_number]);

            return {
                id: newUser[0].id,
                login: newUser[0].login,
                email: newUser[0].email,
                confirmed: newUser[0].confirmed,
            }
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }
}

export const authService = new AuthService();