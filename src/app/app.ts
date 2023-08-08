import cors from 'cors';
import express from 'express';
import coockeyParser from 'cookie-parser';
import { authRouter } from '../routes/authRouter';
import { todosRouter } from '../routes/todosRouter';
import { tasksRouter } from '../routes/tasksRouter';
import { errorsMiddleware } from '../middlewares/errorsMiddleware';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(coockeyParser());

app.use('/auth', authRouter);
app.use('/todos', todosRouter);
app.use('/todos/', tasksRouter);

app.use(errorsMiddleware);

export { app };