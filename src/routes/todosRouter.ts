import express from 'express';
import { todoController } from '../controllers/todosController';

const router = express.Router();

router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export const todosRouter = router;