class ErrorHandler {
    databaseError(err: Error | unknown): Error {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        if (typeof err === 'string') {
            throw new Error(err);
        }
        return new Error("unknow database error");
    }
}

export const errorHandler = new ErrorHandler();