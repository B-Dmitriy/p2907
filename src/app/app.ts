import cors from 'cors';
import express from 'express';
import coockeyParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import { authRouter } from '../routes/authRouter';
import { swaggerConfig } from '../config/swagger';
import { todosRouter } from '../routes/todosRouter';
import { tasksRouter } from '../routes/tasksRouter';
import { errorsMiddleware } from '../middlewares/errorsMiddleware';
import 'dotenv/config';

const app = express();

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerConfig)
);

app.use(express.json());
app.use(cors());
app.use(coockeyParser());

app.use('/auth', authRouter);
/**
* @swagger
* 
* /todos
*   get:
*     description: contains a reference outside this file
*     x-amazon-apigateway-integration: *default-integration
*/
app.use('/todos', todosRouter);
app.use('/todos/', tasksRouter);

app.use(errorsMiddleware);

export { app };