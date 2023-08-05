import { Request, Response } from 'express';
import { todosService } from '../services/todosService';
import { errorHandler } from './../utils/errorHandler';

const DEFAULT_LIMIT: string = '10';
const DEFAULT_PAGE: string = '1';

class TodoController {
    async getTodos(req: Request<any, any, any, {
        userId: string,
        limit: string,
        page: string,
    }>, res: Response) {
        const {
            userId,
            limit = DEFAULT_LIMIT,
            page = DEFAULT_PAGE
        } = req.query;

        if (!userId || isNaN(parseInt(userId)) || parseInt(userId) < 1) {
            res.status(400).send({ massage: "userId is required and must be a positive integer" });
            return;
        }

        if (isNaN(parseInt(limit)) || parseInt(limit) < 1) {
            res.status(400).send({ massage: "limit must be a positive integer" });
            return;
        }

        if (isNaN(parseInt(page)) || parseInt(page) < 1) {
            res.status(400).send({ massage: "page must be a positive integer" });
            return;
        }

        try {
            const data = await todosService.getTodos(userId, limit, page);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async getTodoById(req: Request<any, any, any, { userId: string }>, res: Response) {
        const { userId } = req.query;

        if (!userId || isNaN(parseInt(userId)) || parseInt(userId) < 1) {
            res.status(400).send({ massage: "userId is required and must be a positive integer" });
            return;
        }

        const todoId = req.params.todoId;

        if (!todoId || isNaN(parseInt(todoId)) || parseInt(todoId) < 1) {
            res.status(400).send({ massage: "todoId is required and must be a positive integer" });
            return;
        }

        try {
            const todoId = req.params.todoId;

            const data = await todosService.getTodoById(userId, todoId);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async createTodo(req: Request, res: Response) {
        try {
            const title = req.body.title;

            const data = await todosService.createTodo(title);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async updateTodo(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { title, is_done } = req.body;

            const data = await todosService.updateTodo(id, title, is_done);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async deleteTodo(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const deletedId = await todosService.deleteTodo(id);

            res.send({ deleted: deletedId });
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }
}

export const todoController = new TodoController();