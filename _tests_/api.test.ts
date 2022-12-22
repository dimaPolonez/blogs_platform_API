import request from 'supertest';
import { app } from '../src';

describe('/', () => {
  it('server start', async () => {
    await request(app).get('/').expect(200);
  });

});
