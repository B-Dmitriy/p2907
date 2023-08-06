import { db } from '../config/database';
import { ITodo } from '../models/todosModels';
import { errorHandler } from '../utils/errorHandler';

class TodosService {
    async getTodos(userId: string, limit: string, page: string): Promise<ITodo[] | Error> {
        try {
            const offset = page === '1' ? 0 : (parseInt(page) * parseInt(limit) - parseInt(limit));

            const data = await db.any(`SELECT * FROM todolist.todos 
            WHERE user_id = $1 
            LIMIT $2 
            OFFSET $3`, [userId, limit, offset]);

            return data;
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async getTodoById(userId: string, todoId: string): Promise<ITodo | Error> {
        try {
            const data = await db.any(`SELECT * FROM todolist.todos 
            WHERE user_id = $1 AND id=$2`, [userId, todoId]);

            if (!data.length) throw "Todo with id: " + todoId + " for user: " + userId + " not found";

            return data[0];
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async createTodo(userId: string, title: string, description: string, deadline: string): Promise<ITodo | Error> {
        try {
            /** TODO: RETURNING WORKING */
            const data = await db.any(`INSERT INTO todolist.todos
            (user_id, title, description, deadline) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
                [userId, title, description, deadline]);

            return { ...data[0], title, is_done: false }
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async updateTodo(userId: string, todoId: string, title: string, description: string, is_done: boolean, deadline: string): Promise<ITodo | Error> {
        try {
            const timeNow = new Date().toISOString();
            /** TODO: RETURNING NOT WORKING */
            await db.any(`UPDATE todolist.todos 
            SET title = $1,
            description = $2,
            is_done = $3,
            deadline = $4,
            updated_at = $5
            WHERE user_id = $6 AND id = $7;`,
                [title, description, is_done, deadline, timeNow, userId, todoId]);

            return { id: todoId, title, is_done };
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async deleteTodo(userId: string, todoId: string): Promise<any | Error> {
        try {
            const returned = await db.any("DELETE FROM todolist.todos WHERE user_id = $1 AND id = $2 RETURNING *;", [userId, todoId]);

            if (!returned.length) throw "Todo with id: " + todoId + " for user: " + userId + " not found";

            return returned;
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }
}

export const todosService = new TodosService();