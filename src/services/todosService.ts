import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import { ITodo } from '../models/todosModels';

class TodosService {
    async getTodos(userId: string, limit: string, page: string): Promise<ITodo[] | Error> {
        try {
            const offset = page === '1' ? 0 : (parseInt(page) * parseInt(limit) - parseInt(limit));

            const data = await db.any(`
                SELECT * FROM todolist.todos 
                WHERE user_id = $1 
                LIMIT $2 OFFSET $3`,
                [userId, limit, offset]);

            return data;
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async getTodoById(userId: string, todoId: string): Promise<ITodo | Error> {
        try {
            const todos = await db.any(`
                SELECT * FROM todolist.todos 
                WHERE user_id = $1 AND id=$2`,
                [userId, todoId]);

            if (!todos.length) throw APIError.NotFound(`Todo with id: ${todoId} for user: ${userId} not found`);

            return todos[0];
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async createTodo(userId: string, title: string, description: string, deadline: string) {
        try {
            const newTodos = await db.any(`
                INSERT INTO todolist.todos
                (user_id, title, description, deadline) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *;`,
                [userId, title, description, deadline]);

            return newTodos[0];
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async updateTodo(userId: string, todoId: string, title: string, description: string, is_done: boolean, deadline: string): Promise<ITodo | Error> {
        try {
            const timeNow = new Date().toISOString();

            const modify = await db.any(`
                UPDATE todolist.todos 
                SET title = $1,
                description = $2,
                is_done = $3,
                deadline = $4,
                updated_at = $5
                WHERE user_id = $6 AND id = $7 
                RETURNING *;`,
                [title, description, is_done, deadline, timeNow, userId, todoId]);

            if (!modify.length) throw APIError.NotFound(`Todo with id: ${todoId} for user: ${userId} not found`);

            return modify[0];
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async deleteTodo(userId: string, todoId: string): Promise<any | Error> {
        try {
            const deleted = await db.any(`
                DELETE FROM todolist.todos 
                WHERE user_id = $1 AND id = $2 
                RETURNING *;`,
                [userId, todoId]);

            if (!deleted.length) throw APIError.NotFound(`Todo with id: ${todoId} for user: ${userId} not found`);

            return deleted[0];
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }
}

export const todosService = new TodosService();