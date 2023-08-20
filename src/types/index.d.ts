import { TRequestUser } from '../models/authModels';

export { };

declare global {
    namespace Express {
        interface Request {
            user: TRequestUser
        }
    }
}
