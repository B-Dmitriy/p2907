import { db } from '../config/database';
import { errorHandler } from '../utils/errorHandler';
import { IPublicUserData, IUser } from '../models/authModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    async me(token: string): Promise<IPublicUserData | Error> {
        try {
            const userData = jwt.decode(token);

            const id = typeof userData === 'object' ? userData?.id : '';

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

    async getUser(id: string): Promise<IPublicUserData | Error> {
        try {
            const users = await db.any("SELECT * FROM users WHERE id = $1;", id);

            if (!users.length) throw "User with id: " + id + " not found";

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
                id: user.id,
                role: user.role,
            }, 'secret');

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

    async registration(data: IUser): Promise<IPublicUserData | Error> {
        try {
            const users = await db.any("SELECT * FROM users WHERE login = $1;", data.login);

            if (users.length) throw "User with login: " + data.login + " already existing";

            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(data.password, salt);

            const id = Date.now();

            await db.any("INSERT INTO users" +
                "(id, login, password, email, phone_number, role)" +
                "VALUES (${id}, ${login}, ${password}, ${email}, ${phone_number}, ${role});", {
                ...data,
                id: id,
                password: hashPassword,
            });

            const user = { ...data };

            return {
                id: id.toString(),
                login: user.login,
                email: user.email,
            };
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }
}

export const authService = new AuthService();