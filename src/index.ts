import cors from 'cors';
import express from 'express';
import coockeyParser from 'cookie-parser';
import { authRouter } from './routes/authRouter';
import { todosRouter } from './routes/todosRouter';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());
app.use(coockeyParser());

app.use('/auth', authRouter);
app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

