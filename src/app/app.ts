import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
// import swaggerUI from 'swagger-ui-express';
import { authRouter } from '../routes/authRouter';
// import { swaggerConfig } from '../config/swagger';
import { todosRouter } from '../routes/todosRouter';
import { tasksRouter } from '../routes/tasksRouter';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorsMiddleware } from '../middlewares/errorsMiddleware';
import 'dotenv/config';

const app = express();

// app.use(
//     "/docs",
//     swaggerUI.serve,
//     swaggerUI.setup(swaggerConfig)
// );

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todos', authMiddleware, todosRouter);
app.use('/api/v1/tasks', authMiddleware, tasksRouter);

app.use(errorsMiddleware);

export { app };
