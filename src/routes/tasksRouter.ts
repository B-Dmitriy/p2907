import express from 'express';
import { tasksController } from '../controllers/tasksController';

const router = express.Router();

router.get('/:todoId/tasks', tasksController.getTasks);
router.post('/:todoId/tasks', tasksController.createTask);
router.get('/:todoId/tasks/:taskId', tasksController.getTaskById);
router.put('/:todoId/tasks/:taskId', tasksController.updateTask);
router.delete('/:todoId/tasks/:taskId', tasksController.deleteTask);

export const tasksRouter = router;