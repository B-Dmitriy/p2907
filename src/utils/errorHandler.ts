import { Response } from 'express';

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

    notFound(res: Response, err: Error | unknown) {
        if (err instanceof Error) {
            res.status(404).send({
                code: 404,
                message: err.message
            })
        } else {
            res.status(500).send({
                code: 500,
                message: 'Server error'
            })
        }
    }

    badrequest(res: Response, err: Error | unknown) {
        if (err instanceof Error) {
            res.status(400).send({
                code: 400,
                message: err.message
            })
        } else {
            res.status(500).send({
                code: 500,
                message: 'Server error'
            })
        }
    }
}
console.log("created");
export const errorHandler = new ErrorHandler();