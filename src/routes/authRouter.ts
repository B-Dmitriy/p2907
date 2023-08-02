import express from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

router.post('/me', authController.me);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.post('/registration', authController.registration);

export const authRouter = router;