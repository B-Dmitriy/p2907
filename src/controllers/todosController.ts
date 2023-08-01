import { Request, Response } from 'express';
import { todosService } from '../services/todosService';
import { errorHandler } from './../utils/errorHandler';

class TodoController {
    async getTodos(req: Request, res: Response) {
        try {
            const data = await todosService.getTodos();

            res.send(data);
        } catch (err: Error | unknown) {
            return errorHandler.notFound(res, err);
        }
    }

    async getTodoById(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const data = await todosService.getTodoById(id);

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