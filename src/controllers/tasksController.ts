import { tasksService } from '../services/tasksService';
import type { Response, NextFunction } from "express";
import type {
    GetTasksRequest,
    GetTasksByIdRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
} from '../models/tasksModels';
import { APIError } from '../utils/APIError';

const DEFAULT_LIMIT: string = '5';
const DEFAULT_PAGE: string = '1';

class TasksController {
    async getTasks(req: GetTasksRequest, res: Response, next: NextFunction) {
        try {
            const { todoId } = req.params;
            const { id: userId } = req.user;
            const { id: tokenUserId } = req.user;
            const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = req.query;

            if (userId !== tokenUserId) throw APIError.Forbidden();

            const tasks = await tasksService.getTasks(todoId, limit, page);

            res.send(tasks);
        } catch (err) {
            next(err);
        }
    }

    async getTaskById(req: GetTasksByIdRequest, res: Response, next: NextFunction) {
        try {
            const { todoId, taskId } = req.params;
            const { id: userId } = req.user;
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

            res.send({ deleted: tasks });
        } catch (err) {
            next(err);
        }
    }
}

export const tasksController = new TasksController();