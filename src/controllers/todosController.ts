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
            const data = await todosService.getTodoById(userId, todoId);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async createTodo(req: Request<any, {
        title: string,
        description: string,
        deadline: string,
    }, any, { userId: string }>, res: Response) {
        const { userId } = req.query;

        if (!userId || isNaN(parseInt(userId)) || parseInt(userId) < 1) {
            res.status(400).send({ massage: "userId is required and must be a positive integer" });
            return;
        }

        try {
            const { title, description = "", deadline = "" } = req.body;

            const data = await todosService.createTodo(userId, title, description, deadline);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async updateTodo(req: Request<any, {
        title: string,
        description: string,
        is_done: boolean,
        deadline: string,
    }, any, { userId: string }>, res: Response) {
        try {
            const { userId } = req.query;
            const todoId = req.params.id;
            const { title, description, is_done, deadline } = req.body;

            const deadlineDate = new Date(deadline);

            const data = await todosService.updateTodo(userId, todoId, title, description, is_done, deadlineDate);

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async deleteTodo(req: Request<any, any, any, { userId: string }>, res: Response) {
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