import express from 'express';
import { body, param, query } from 'express-validator';
import { tasksController } from '../controllers/tasksController';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = express.Router();

router.get('/:todoId/tasks',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage("todoId is required and must be a positive integer"),
    query('userId').notEmpty().trim().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    query('limit').optional().trim().isInt({ min: 1 }).withMessage("limit must be a positive integer"),
    query('page').optional().trim().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    validationMiddleware,
    tasksController.getTasks);

router.post('/:todoId/tasks',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage("todoId is required and must be a positive integer"),
    query('userId').notEmpty().trim().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    body('title').notEmpty().trim().withMessage("title is required"),
    body('description').optional().isLength({ max: 240 }).withMessage("max length for description 240 chars"),
    validationMiddleware,
    tasksController.createTask);

router.get('/:todoId/tasks/:taskId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage("todoId is required and must be a positive integer"),
    param('taskId').notEmpty().trim().isInt({ min: 1 }).withMessage("taskId is required and must be a positive integer"),
    query('userId').notEmpty().trim().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    validationMiddleware,
    tasksController.getTaskById);

router.put('/:todoId/tasks/:taskId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage("todoId is required and must be a positive integer"),
    param('taskId').notEmpty().trim().isInt({ min: 1 }).withMessage("taskId is required and must be a positive integer"),
    query('userId').notEmpty().trim().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    body('title').optional().notEmpty().trim().withMessage("title is required"),
    body('description').optional().isLength({ max: 240 }).withMessage("max length for description 240 chars"),
    body('isDone').optional().isBoolean(),
    validationMiddleware,
    tasksController.updateTask);

router.delete('/:todoId/tasks/:taskId',
    param('todoId').notEmpty().trim().isInt({ min: 1 }).withMessage("todoId is required and must be a positive integer"),
    param('taskId').notEmpty().trim().isInt({ min: 1 }).withMessage("taskId is required and must be a positive integer"),
    query('userId').notEmpty().trim().isInt({ min: 1 }).withMessage("userId is required and must be a positive integer"),
    validationMiddleware,
    tasksController.deleteTask);

export const tasksRouter = router;