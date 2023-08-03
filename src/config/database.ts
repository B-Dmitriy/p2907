import pgPromise from 'pg-promise';

const pgp = pgPromise();

export const db = pgp("postgres://postgres:postgres@localhost:5432/postgres");