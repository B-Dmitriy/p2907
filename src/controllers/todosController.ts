import { todosService } from '../services/todosService';
import type { NextFunction, Response } from 'express';
import { DEFAULT_LIMIT_TODOS, DEFAULT_PAGE_TODOS } from '../config/constants';
import type {
    GetTodosRequest,
    GetTodoByIdRequest,
    CreateTodoRequest,
    UpdateTodoRequest,
    DeleteTodoRequest
} from '../models/todosModels';

class TodoController {
    async getTodos (req: GetTodosRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = req.user;
            const { limit = DEFAULT_LIMIT_TODOS, page = DEFAULT_PAGE_TODOS, isDone } = req.query;

            let isDoneForService: undefined | boolean;
            if (typeof isDone !== 'undefined' && isDone === 'true') {
                isDoneForService = true;
            }
            if (typeof isDone !== 'undefined' && isDone === 'false') {
                isDoneForService = false;
            }

            const data = await todosService.getTodos(userId, limit, page, isDoneForService);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async getTodoById (req: GetTodoByIdRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = req.user;
            const { todoId } = req.params;

            const data = await todosService.getTodoById(userId, todoId);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async createTodo (req: CreateTodoRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = req.user;
            const { title, description, deadline } = req.body;

            const data = await todosService.createTodo(userId, title, description, deadline);

            res.status(201).send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async updateTodo (req: UpdateTodoRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = req.user;
            const { todoId } = req.params;
            const { title, description, isDone, deadline } = req.body;

            const data = await todosService.updateTodo(userId, todoId, title, description, isDone, deadline);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async deleteTodo (req: DeleteTodoRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = req.user;
            const { todoId } = req.params;

            const deleted = await todosService.deleteTodo(userId, todoId);

            res.send(deleted);
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const todoController = new TodoController();
