import request from 'supertest';
import { app } from '../../src/app/app';
import { db } from '../../src/config/database';

describe('/todos', () => {
    afterAll(() => {
        db.$pool.end();
    });

    // it('should be 200', async () => {
    //     await request(app)
    //         .get('/api/v1/todos')
    //         .expect(200);
    // });

    it('should be 401', async () => {
        await request(app)
            .get('/api/v1/todos')
            .expect(401);
    });
});
