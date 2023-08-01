import express from 'express';
import { todosRouter } from './routes/todosRouter';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

