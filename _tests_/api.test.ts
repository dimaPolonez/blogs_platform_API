import { response } from 'express';
import request from 'supertest';
import {app} from '../src';


describe('/', () => {

    it('server start', async () => {
        await request(app).get('/')
            .expect(200);
    });

    it('blogs', async () => {
        await request(app).get('/blogs/')
            .expect(200);
    });

    it('blogs', async () => {
        const response = await request(app).get("/blogs/");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("decription");
        expect(response.body).toHaveProperty("websiteUrl");
        expect(response.body).toHaveProperty("createdAt");
        expect(response.statusCode).toBe(200);
    });

});
