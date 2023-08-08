import { Response, NextFunction } from "express";
import { tasksService } from '../services/tasksService';
import {
    GetTasksRequest,
    GetTasksByIdRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
} from '../models/tasksModels';

const DEFAULT_LIMIT: string = '5';
const DEFAULT_PAGE: string = '1';

class TasksController {
    async getTasks(req: GetTasksRequest, res: Response, next: NextFunction) {
        try {
            const { todoId } = req.params;
            const {
                userId,
                limit = DEFAULT_LIMIT,
                page = DEFAULT_PAGE
            } = req.query;

            const tasks = await tasksService.getTasks(todoId, limit, page);

            res.send(tasks);
        } catch (err) {
            next(err);
        }
    }

    async getTaskById(req: GetTasksByIdRequest, res: Response, next: NextFunction) {
        try {
            const { todoId, taskId } = req.params;
            const { userId } = req.query;

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
            const { title, description } = req.body;

            const task = await tasksService.createTask(todoId, title, description);

            res.send(task);
        } catch (err) {
            res.status(400).send({ message: 'Bad request' });
        }
    }

    async updateTask(req: UpdateTaskRequest, res: Response, next: NextFunction) {
        try {
            const { todoId, taskId } = req.params;
            const { userId } = req.query;
            const { title, description, isDone } = req.body;

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

            const tasks = await tasksService.deleteTask(todoId, taskId);

            res.send({ deleted: tasks });
        } catch (err) {
            next(err);
        }
    }
}

export const tasksController = new TasksController();