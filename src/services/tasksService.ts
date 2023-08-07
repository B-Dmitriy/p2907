import { db } from '../config/database';
import { Task } from '../models/tasksModels';

class TasksService {
    async getTasks(todoId: string, limit: string, page: string): Promise<Task[] | Error> {
        try {
            const offset = page === '1' ? 0 : (parseInt(page) * parseInt(limit) - parseInt(limit));

            const tasks = await db.any(`
                SELECT * FROM todolist.tasks 
                WHERE todo_id = $1 LIMIT $2 OFFSET $3`,
                [todoId, limit, offset]
            );

            return tasks;
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }

    async getTasksById(todoId: string, taskId: string): Promise<Task | Error> {
        try {
            const task = await db.any(`
                SELECT * FROM todolist.tasks 
                WHERE todo_id = $1 AND id = $2;`,
                [todoId, taskId]
            );

            return task[0];
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }

    async createTask(todoId: string, title: string, description: string) {
        try {
            const task = await db.any(`
                INSERT INTO todolist.tasks (todo_id, title, description)
                VALUES ($1, $2, $3) RETURNING *;`,
                [todoId, title, description]
            );

            return task[0];
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }

    async updateTask(todoId: string, taskId: string, title: string, description: string, is_done: boolean) {
        try {
            const task = await db.any(`
                UPDATE todolist.tasks SET
                title = $1,
                description = $2,
                is_done = $3
                WHERE todo_id = $4 AND id = $5;`,
                [title, description, is_done, todoId, taskId]
            );

            return task[0];
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }

    async deleteTask(todoId: string, taskId: string) {
        try {
            const tasks = await db.any(`
                DELETE FROM todolist.tasks
                WHERE todo_id = $1 AND id = $2 RETURNING *;`,
                [todoId, taskId]
            );

            return tasks;
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }
}

export const tasksService = new TasksService();