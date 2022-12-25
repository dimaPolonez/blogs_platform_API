import request from 'supertest';
import {app} from '../src';
import {blogsFieldsType} from "../src/models/data.models";


describe('/', () => {
    it('server start', async () => {
        await request(app).get('/')
            .expect(200);
    });

    it('view all blogs', async () => {
        await request(app).get('/blogs').expect(200);
    });

    it('create new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({title: "Dima", author: "DimaDima", availableResolutions: "vk.com"})
            .expect(201)
    });

    it('create new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({title: "Dima", author: "DimaDima", availableResolutions: "vk.com"})
            .expect(201)
    });



});
