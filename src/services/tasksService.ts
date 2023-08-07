import { db } from '../config/database';
import { Task } from '../models/tasksModels';

class TasksService {
    async getTasks(todoId: string, limit: string, page: string): Promise<Task[] | Error> {
        try {
            const offset = page === '1' ? 0 : (parseInt(page) * parseInt(limit) - parseInt(limit));

            const tasks = await db.any("SELECT * FROM todolist.tasks WHERE todo_id = $1 LIMIT $2 OFFSET $3", [todoId, limit, offset])

            return tasks;
        } catch (err) {
            throw new Error("Tasks database error");
        }
    }
}

export const tasksService = new TasksService();