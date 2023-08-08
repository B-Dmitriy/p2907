import { NextFunction, Response } from 'express';
import { todosService } from '../services/todosService';
import { errorHandler } from '../utils/errorHandler';
import { validator } from '../utils/validator';
import {
    GetTodosRequest,
    GetTodoByIdRequest,
    CreateTodoRequest,
    UpdateTodoRequest,
    DeleteTodoRequest,
} from '../models/todosModels';
import { APIError } from '../utils/APIError';

const DEFAULT_LIMIT: string = '10';
const DEFAULT_PAGE: string = '1';

class TodoController {
    async getTodos(req: GetTodosRequest, res: Response, next: NextFunction) {
        try {
            const {
                userId,
                limit = DEFAULT_LIMIT,
                page = DEFAULT_PAGE
            } = req.query;

            const data = await todosService.getTodos(userId, limit, page);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async getTodoById(req: GetTodoByIdRequest, res: Response) {
        try {
            const { userId } = req.query;
            const { todoId } = req.params;

            const data = await todosService.getTodoById(userId, todoId);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async createTodo(req: CreateTodoRequest, res: Response) {
        const { userId } = req.query;

        if (!userId || isNaN(parseInt(userId)) || parseInt(userId) < 1) {
            res.status(400).send({ massage: "userId is required and must be a positive integer" });
            return;
        }

        try {
            const { title, description, deadline } = req.body;

            const data = await todosService.createTodo(userId, title, description, deadline);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async updateTodo(req: UpdateTodoRequest, res: Response) {
        try {
            const { userId } = req.query;
            const { todoId } = req.params;
            const { title, description, is_done, deadline } = req.body;


            if (!validator.isIsoDate(deadline) && deadline !== null) {
                res.status(400).send({ massage: "deadline must be ISOStrig time or null" });
                return;
            }

            const data = await todosService.updateTodo(userId, todoId, title, description, is_done, deadline);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async deleteTodo(req: DeleteTodoRequest, res: Response) {
        const { userId } = req.query;
        try {
            const todoId = req.params.todoId;

            const deleted = await todosService.deleteTodo(userId, todoId);

            res.send({ deleted: deleted });
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }
}

export const todoController = new TodoController();