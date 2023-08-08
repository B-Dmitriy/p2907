import { NextFunction, Response } from 'express';
import { todosService } from '../services/todosService';
import {
    GetTodosRequest,
    GetTodoByIdRequest,
    CreateTodoRequest,
    UpdateTodoRequest,
    DeleteTodoRequest,
} from '../models/todosModels';

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

    async getTodoById(req: GetTodoByIdRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const { todoId } = req.params;

            const data = await todosService.getTodoById(userId, todoId);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async createTodo(req: CreateTodoRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const { title, description, deadline } = req.body;
            const data = await todosService.createTodo(userId, title, description, deadline);

            res.status(201).send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async updateTodo(req: UpdateTodoRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const { todoId } = req.params;
            const { title, description, is_done, deadline } = req.body;

            const data = await todosService.updateTodo(userId, todoId, title, description, is_done, deadline);

            res.send(data);
        } catch (err: Error | unknown) {
            next(err);
        }
    }

    async deleteTodo(req: DeleteTodoRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.query;
            const todoId = req.params.todoId;

            const deleted = await todosService.deleteTodo(userId, todoId);

            res.send({ deleted: deleted });
        } catch (err: Error | unknown) {
            next(err);
        }
    }
}

export const todoController = new TodoController();