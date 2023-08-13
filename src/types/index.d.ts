export { };

import { TRequestUser } from '../models/authModels';

declare global {
    namespace Express {
        interface Request {
            user: TRequestUser;
        }
    }
}
