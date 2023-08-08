import express from 'express';
import { query } from 'express-validator';
import { todoController } from '../controllers/todosController';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = express.Router();

router.get('/',
    query('userId').trim().notEmpty().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    query('limit').trim().isInt({ min: 1 }).withMessage("limit must be a positive integer"),
    query('page').trim().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    validationMiddleware,
    todoController.getTodos);

router.post('/', todoController.createTodo);
router.get('/:todoId', todoController.getTodoById);
router.put('/:todoId', todoController.updateTodo);
router.delete('/:todoId', todoController.deleteTodo);

export const todosRouter = router;