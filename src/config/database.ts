import 'dotenv/config';
import pgPromise from 'pg-promise';

const pgp = pgPromise();

export const db = pgp({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT)
});
