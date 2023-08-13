import supertest from 'supertest'
import {TestObjectType} from "../src/models";



export function blogFlow(api: supertest.SuperTest<supertest.Test>, testObject: TestObjectType) {

    describe('blogFlow tests start', () => {

        let deleteBlogId: string = ''
        let postIdByBlogId: string = ''
        let notFound: string = '63f0e789e8f1762c4ba45f3e'

        it('get all blog status 200', async () => {
            await api.get('/blogs/')
                .expect(200)
        })

        it('get id blog status 200', async () => {
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

        it('put id blog status 404', async () => {
            await api.put(`/blogs/${notFound}`).set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    name: 'Test blog upd',
                    description: "My test blog update",
                    websiteUrl: "polonezUpdateTestBlog.com"
                })
                .expect(404)
        })

        it('put id blog status 204', async () => {
            await api.put(`/blogs/${testObject.blogID}`).set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    name: 'Test blog upd',
                    description: "My test blog update",
                    websiteUrl: "polonezUpdateTestBlog.com"
                })
                .expect(204)
        })

        it('get id blogUpdate status 200', async () => {
            await api.get(`/blogs/${testObject.blogID}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.blogID,
                        name: 'Test blog upd',
                        description: "My test blog update",
                        websiteUrl: "polonezUpdateTestBlog.com",
                        createdAt: expect.any(String)
                    })
                })
        })

             it('post new post by id blog status 201', async () => {
                 await api.post(`/blogs/${testObject.blogID}/posts`).set('Authorization', `Basic ${testObject.basic}`)
                     .send({
                         title: 'Test post by blog',
                         shortDescription: "My test post by blog",
                         content: "My test content by blog",
                     })
                     .expect(201)
                     .expect((res) => {
                         postIdByBlogId = res.body.id
                     })
             })

             it('get post by id blog status 200', async () => {
                 await api.get(`/posts/${postIdByBlogId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                     .expect(200)
                     .then((res) => {
                         expect(res.body).toEqual({
                             id: postIdByBlogId,
                             title: 'Test post by blog',
                             shortDescription: "My test post by blog",
                             content: "My test content by blog",
                             blogId: testObject.blogID,
                             blogName: 'Test blog upd',
                             createdAt: expect.any(String),
                             extendedLikesInfo: {
                                 likesCount: expect.any(Number),
                                 dislikesCount: expect.any(Number),
                                 myStatus: expect.any(String),
                                 newestLikes: expect.any(Array)
                             }
                         })
                     })
             })

        it('post new deleteBlog status 201', async () => {
            await api.post("/blogs").set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    name: 'Delete blog',
                    description: "My delete blog",
                    websiteUrl: "polonezDeleteBlog.com"
                })
                .expect(201)
                .expect((res) => {
                    deleteBlogId = res.body.id
                })
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: 'Delete blog',
                        description: "My delete blog",
                        websiteUrl: "polonezDeleteBlog.com",
                        createdAt: expect.any(String)
                    })
                })
        })

        it('delete blog status 404', async () => {
            await api.delete(`/blogs/${notFound}`).set('Authorization', `Basic ${testObject.basic}`)
                .expect(404)
        })

        it('delete blog status 204', async () => {
            await api.delete(`/blogs/${deleteBlogId}`).set('Authorization', `Basic ${testObject.basic}`)
                .expect(204)
        })

        it('get id blogDelete status 404', async () => {
            await api.get(`/blogs/${deleteBlogId}`)
                .expect(404)
        })

    })
}