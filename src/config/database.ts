import pgPromise from 'pg-promise';

const pgp = pgPromise();

export const db = pgp({
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
});
