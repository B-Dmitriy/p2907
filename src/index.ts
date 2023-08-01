import express from 'express';
import { todosRouter } from './routes/todosRouter';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

