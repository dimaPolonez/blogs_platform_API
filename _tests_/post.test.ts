import supertest from 'supertest'
import { testObject } from '../src/models/request.models';



export function postFlow(api: supertest.SuperTest<supertest.Test>, testObject: testObject) {


    describe('postFlow tests start', () => {

        it('get all blog', async () => {
            await api.get('/blogs/')
                .expect(200)
        })

        it('get blog by id', async () => {
            await api.get(`/blogs/${testObject.blogID}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.blogID,
                        name: 'Test blog',
                        description: "My test blog",
                        websiteUrl: "polonezTestBlog.com",
                        createdAt: expect.any(String)
                    })
                })
        })
    })
}



