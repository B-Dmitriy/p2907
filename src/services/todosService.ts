import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = pgp("postgres://postgres:postgres@localhost:5432/postgres");

class TodosService {
    async getTodos() {
        try {
            const data = await db.any("SELECT * FROM todos");

            return data;
        } catch(err) {
            throw new Error("getTodos error");
        }
        
    }

    async getTodoById(id: string) {
        try {
            const data = await db.any("SELECT * FROM todos WHERE id=$1", id);

            if (!data.length) throw "Todo with id: " + id + " not found";

            return data[0];
        } catch(err) {
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            if (typeof err === 'string') {
                throw new Error(err);
            }
        }
    }
}

export const todosService = new TodosService();