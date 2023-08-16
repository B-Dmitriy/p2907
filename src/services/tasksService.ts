import { db } from '../config/database';
import { APIError } from '../utils/APIError';
import { Task } from '../models/tasksModels';

class TasksService {
    async getTasks(todoId: string, limit: string, page: string): Promise<Task[]> {
        try {
            const offset = page === '1' ? 0 : (parseInt(page) * parseInt(limit) - parseInt(limit));

            const tasks = await db.any(`
                SELECT * FROM todolist.tasks 
                WHERE todo_id = $1 LIMIT $2 OFFSET $3`,
                [todoId, limit, offset]
            );

            return tasks;
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async getTasksById(todoId: string, taskId: string): Promise<Task> {
        try {
            const tasks = await db.any(`
                SELECT * FROM todolist.tasks 
                WHERE todo_id = $1 AND id = $2;`,
                [todoId, taskId]
            );

            if (!tasks.length) throw APIError.NotFound(`Task with id: ${taskId} for todolist: ${todoId}: not found`);

            return tasks[0];
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async createTask(todoId: string, title: string, description: string): Promise<Task> {
        try {
            const task = await db.any(`
                INSERT INTO todolist.tasks 
                (todo_id, title, description)
                VALUES ($1, $2, $3) 
                RETURNING *;`,
                [todoId, title, description]
            );

            return task[0];
        } catch (err) {
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async updateTask(todoId: string, taskId: string, title: string, description: string, is_done: boolean) {
        try {
            const modify = await db.any(`
                UPDATE todolist.tasks SET
                title = $1,
                description = $2,
                is_done = $3
                WHERE todo_id = $4 AND id = $5
                RETURNING *;`,
                [title, description, is_done, todoId, taskId]
            );

            if (!modify.length) throw APIError.NotFound(`Task with id: ${taskId} for todo: ${todoId} not found`);

            return modify[0];
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }

    async deleteTask(todoId: string, taskId: string) {
        try {
            const tasks = await db.any(`
                DELETE FROM todolist.tasks
                WHERE todo_id = $1 AND id = $2 
                RETURNING *;`,
                [todoId, taskId]
            );

            return tasks;
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw APIError.DatabaseError(`Database error: ${err}`);
        }
    }
}

export const tasksService = new TasksService();
