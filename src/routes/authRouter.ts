import express from 'express';
import { body, header, param, query } from 'express-validator';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = express.Router();

router.get('/me',
    header('Authorization')
        .notEmpty().withMessage("Authorization header is required"),
    validationMiddleware,
    authMiddleware,
    authController.me);

router.post('/login',
    body('login')
        .trim().notEmpty().isLength({ min: 3 }).withMessage("login required and must be longest 3 chars"),
    body('password')
        .trim().notEmpty().withMessage("password required")
        .isLength({ min: 5 }).withMessage("password must be longest 5 chars"),
    validationMiddleware,
    authController.login);

router.post('/registration',
    body('login')
        .trim().notEmpty().isLength({ min: 3 }).withMessage("login required and must be longest 3 chars"),
    body('password')
        .trim().notEmpty().withMessage("password required")
        .isLength({ min: 5 }).withMessage("password must be longest 5 chars"),
    body('email')
        .isEmail().withMessage("Not valid email"),
    validationMiddleware,
    authController.registration);

export const authRouter = router;