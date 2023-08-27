import { app } from './app/app';
import { db } from './config/database';
import http from "http";

const PORT = process.env.PORT || 7000;

const isDatabaseReady = db.$pool.connect();
let server: http.Server;

isDatabaseReady
    .then(() => {
        console.log('Database connection comlete');

        try {
            server = app.listen(PORT, () => {
                console.log(`Server start on port ${PORT}`);
            });
        } catch (err) {
            db.$pool.end();
            server.close();
            console.log('Server start error: ', err);

        }
    })
    .catch((err) => {
        db.$pool.end();
        server.close();
        console.log("Fatal: ", err);
    });
