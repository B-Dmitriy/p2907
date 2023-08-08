import { ValidationError } from 'express-validator'

class APIError extends Error {
    status: number;
    message: string;
    errors: ValidationError[];

    constructor(status: number, message: string, errors?: ValidationError[]) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors || [];
    }

    static NotAuthorized() {
        return new APIError(401, "Not authorized");
    }

    static BadRequest(message: string, errors: ValidationError[]) {
        return new APIError(400, message, errors);
    }

    static NotFound(message: string) {
        return new APIError(404, message);
    }

    static DatabaseError(message: string) {
        return new APIError(500, message);
    }
}

export { APIError };