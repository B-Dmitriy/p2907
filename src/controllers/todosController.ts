import { Request, Response } from 'express';
import { todosService } from '../services/todosService';

class TodoController {
    async getTodos(req: Request, res: Response) {
        try {
            const data = await todosService.getTodos();

            res.send(data);
        } catch(err: any) {
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
        } catch(err: any) {
            res.statusCode = 404;
            res.send({
                code: 404,
                message: err.message
            })
        }
    }

    async createTodo(req: Request, res: Response) {
        res.send('Got a POST request at /todos');
    }

    async updateTodo(req: Request, res: Response) {
        const id = req.params.id;
        res.send('Got a PUT request at /todos with id: ' + id);
    }

    async deleteTodo(req: Request, res: Response) {
        const id = req.params.id;
        res.send('Got a DELETE request at /todos with id: ' + id);
    }
}

export const todoController = new TodoController();