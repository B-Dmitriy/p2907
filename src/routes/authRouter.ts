import express from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', authMiddleware, authController.me);
router.post('/login', authController.login);
router.post('/registration', authController.registration);

export const authRouter = router;