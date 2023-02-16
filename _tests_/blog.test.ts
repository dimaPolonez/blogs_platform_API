import { ObjectId } from 'mongodb';
import supertest from 'supertest'
import {app} from '../src';

export function blogTest(accessToken: string, refreshToken: string, basic: string) {

    const api = supertest(app)

    describe('/', () => {

        let blogID: ObjectId = new ObjectId()
    
        it('create new blog', async () => {
            await api.post("/blogs").set('Authorization', `Basic ${basic}`)
            .send({
                name: 'Test blog',
                description: "My test blog",
                websiteUrl: "polonezTestBlog.com"
            })
            .expect(201)
            .expect((res) => {

                    blogID = new ObjectId(res.body.id)
                   })
            .then((res) => {
                expect(res.body).toEqual({
                      id: expect.any(String),
                      name: expect.any(String),
                      description: expect.any(String),
                      websiteUrl: expect.any(String),
                      createdAt: expect.any(String)
                    })  
            })
        })

        it('get all blog', async () => {
                await api.get('/blogs/')
                    .expect(200)
           
           
        })
    })
}

