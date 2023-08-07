import { Request, Response, NextFunction } from "express";
import { tasksService } from '../services/tasksService';
import { GetTasksRequest } from '../models/tasksModels';

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
            res.status(400).send({ message: 'Bad request' });
        }
    }

    getTaskById(req: Request, res: Response, next: NextFunction) {

    }

    createTask(req: Request, res: Response, next: NextFunction) {

    }

    updateTask(req: Request, res: Response, next: NextFunction) {

    }

    deleteTask(req: Request, res: Response, next: NextFunction) {

    }
}

export const tasksController = new TasksController();