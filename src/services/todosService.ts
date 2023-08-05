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

    async createTodo(title: string): Promise<ITodo | Error> {
        try {
            const id = Date.now();

            const data = await db.any("INSERT INTO todos (id, title, is_done) VALUES (${id}, ${title}, false) RETURNING id;", { id, title });

            return { ...data[0], title, is_done: false }
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async updateTodo(id: string, title: string, is_done: boolean): Promise<ITodo | Error> {
        try {
            await db.any("UPDATE todos SET title = ${title}, is_done = ${is_done} WHERE id = ${id};", { id, title, is_done });

            return { id, title, is_done };
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }

    async deleteTodo(id: string): Promise<string | Error> {
        try {
            const returned = await db.any("DELETE FROM todos WHERE id = $1 RETURNING id;", id);

            if (!returned.length) throw "Todo with id: " + id + " not found";

            return returned[0].id;
        } catch (err) {
            return errorHandler.databaseError(err);
        }
    }
}

export const todosService = new TodosService();