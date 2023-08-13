import { Secret } from "jsonwebtoken";

export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_ACCESS_SECRET: string;
            JWT_REFRESH_SECRET: string;
            DATABASE_HOST: string;
            DATABASE_PORT: string;
            DATABASE_NAME: string;
            DATABASE_USER: string;
            DATABASE_PASS: string;
        }
    }
}