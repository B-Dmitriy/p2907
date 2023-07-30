import express, {Request, Response} from 'express'
import pgPromise, { IMain } from 'pg-promise'

const app = express()
const port = 3000
const pgp = pgPromise()
const db = pgp("postgres://postgres:postgres@localhost:5432/postgres")

app.get('/', function (req: Request, res: Response) {
  
  db.any("SELECT * FROM todos")
    .then(function (data) {
        res.send(data);
    })
    .catch(function (error) {
      res.send("Error: " + error);
    });
});

app.post('/', function (req, res) {
  res.send('Got a POST request');
});


app.put('/todos', function (req, res) {
  res.send('Got a PUT request at /todos');
});


app.delete('/todos', function (req, res) {
  res.send('Got a DELETE request at /todos');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

