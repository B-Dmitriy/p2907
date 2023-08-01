import { Request, Response } from 'express';
import { todosService } from '../services/todosService';

class TodoController {
    async getTodos(req: Request, res: Response) {
        try {
            const data = await todosService.getTodos();

            res.send(data);
        } catch (err: any) {
            res.statusCode = 404;
            res.send({
                code: 404,
                message: err.message
            })
        }
    }

    async getTodoById(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const data = await todosService.getTodoById(id);

            res.send(data);
        } catch (err: any) {
            res.status(404).send({
                code: 404,
                message: err.message
            })
        }
    }

    async createTodo(req: Request, res: Response) {
        try {
            const title = req.body.title;

            const data = await todosService.createTodo(title);

            res.send(data);
        } catch (err: any) {
            res.status(404).send({
                code: 404,
                message: err.message
            })
        }
    }

    async updateTodo(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { title, is_done } = req.body;

            const data = await todosService.updateTodo(id, title, is_done);

            res.send(data);
        } catch (err: any) {
            res.status(404).send({
                code: 404,
                message: err.message
            })
        }
    }

    async deleteTodo(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const data = await todosService.deleteTodo(id);
            console.log(data);
            res.send({ deleted: id });
        } catch (err: any) {
            res.status(404).send({
                code: 404,
                message: err.message
            })
        }
    }
}

export const todoController = new TodoController();