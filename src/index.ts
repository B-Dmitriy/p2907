import { app } from './app/app';
import { db } from './config/database';

const port = process.env.PORT ?? 7000;

const isDatabaseReady = db.$pool.connect();

isDatabaseReady
    .then(() => {
        console.log('Database connection comlete');

        try {
            app.listen(port, () => {
                console.log(`Server start on port ${port}`);
            });
        } catch (err) {
            console.log('Server start error: ', err);
        }
    })
    .catch((err) => { console.log(err); });
