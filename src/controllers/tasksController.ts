import { APIError } from '../utils/APIError';
import { tasksService } from '../services/tasksService';
import type { Response, NextFunction } from 'express';
import { DEFAULT_LIMIT_TASKS, DEFAULT_PAGE_TASKS } from '../config/constants';
import type {
    GetTasksRequest,
    GetTasksByIdRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
} from '../models/tasksModels';

class TasksController {
    async getTasks(req: GetTasksRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const { todoId } = req.params;
            const { id: tokenUserId } = req.user;
            const { limit = DEFAULT_LIMIT_TASKS, page = DEFAULT_PAGE_TASKS } = req.query;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const tasks = await tasksService.getTasks(todoId, limit, page);

            res.send(tasks);
        } catch (err) {
            next(err);
        }
    }

    async getTaskById(req: GetTasksByIdRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const { todoId, taskId } = req.params;
            const { id: tokenUserId } = req.user;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const task = await tasksService.getTasksById(todoId, taskId);

            res.send(task);
        } catch (err) {
            next(err);
        }
    }

    async createTask(req: CreateTaskRequest, res: Response, next: NextFunction) {
        try {
            const { todoId } = req.params;
            const { userId } = req.query;
            const { id: tokenUserId } = req.user;
            const { title, description } = req.body;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const task = await tasksService.createTask(todoId, title, description);

            res.send(task);
        } catch (err) {
            next(err);
        }
    }

    async updateTask(req: UpdateTaskRequest, res: Response, next: NextFunction) {
        try {
            const { todoId, taskId } = req.params;
            const { userId } = req.query;
            const { id: tokenUserId } = req.user;
            const { title, description, isDone } = req.body;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const task = await tasksService.updateTask(todoId, taskId, title, description, isDone);

            res.send(task);
        } catch (err) {
            next(err);
        }
    }

    async deleteTask(req: DeleteTaskRequest, res: Response, next: NextFunction) {
        try {
            const { todoId, taskId } = req.params;
            const { userId } = req.query;
            const { id: tokenUserId } = req.user;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const tasks = await tasksService.deleteTask(todoId, taskId);

            res.send(tasks[0]);
        } catch (err) {
            next(err);
        }
    }
}

export const tasksController = new TasksController();
