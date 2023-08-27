import express from 'express';
import { validator } from '../utils/Validator';
import { body, param, query } from 'express-validator';
import { todoController } from '../controllers/todosController';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = express.Router();

router.get('/',
    query('limit').optional().trim().isInt({ min: 1 }).withMessage('limit must be a positive integer'),
    query('page').optional().trim().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('isDone').optional().trim().isBoolean().withMessage('page must be boolean'),
    validationMiddleware,
    todoController.getTodos);

router.post('/',
    body('title').notEmpty().trim().withMessage('title is required'),
    body('description').optional().isLength({ max: 240 }).withMessage('max length for description 240 chars'),
    body('deadline').optional().custom(validator.isNullOrISO).withMessage('deadline must be ISO8601 format or null'),
    validationMiddleware,
    todoController.createTodo);

router.get('/:todoId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage('todoId is required and must be a positive integer'),
    validationMiddleware,
    todoController.getTodoById);

router.put('/:todoId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage('todoId is required and must be a positive integer'),
    body('title').optional().notEmpty().trim().withMessage('title is required'),
    body('description').optional().isLength({ max: 240 }).withMessage('max length for description 240 chars'),
    body('deadline').optional().custom(validator.isNullOrISO).withMessage('deadline must be ISO8601 format or null'),
    body('isDone').optional().isBoolean(),
    validationMiddleware,
    todoController.updateTodo);

router.delete('/:todoId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage('todoId is required and must be a positive integer'),
    validationMiddleware,
    todoController.deleteTodo);

export const todosRouter = router;
