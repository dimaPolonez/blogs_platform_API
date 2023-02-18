import supertest from 'supertest'
import { testObject } from '../src/models/request.models';



export function postFlow(api: supertest.SuperTest<supertest.Test>, testObject: testObject) {


    describe('postFlow tests start', () => {

        let deletePostId: string = ''
        let notFound: string = '63f0e789e8f1762c4ba45f3e'

        it('get all posts status 200', async () => {
            await api.get('/posts/').set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
        })

        it('get id post status 200', async () => {
            await api.get(`/posts/${testObject.postID}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: 'Test post',
                        shortDescription: "My test post",
                        content: "My test content",
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
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

        it('put id post status 404', async () => {
            await api.put(`/posts/${notFound}`).set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    title: 'Test update post',
                    shortDescription: "My update post",
                    content: "My test update content",
                    blogId: testObject.blogID,
                })
                .expect(404)
        })

        it('put id post status 204', async () => {
            await api.put(`/posts/${testObject.postID}`).set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    title: 'Test update post',
                    shortDescription: "My update post",
                    content: "My test update content",
                    blogId: testObject.blogID,
                })
                .expect(204)
        })

        it('get id postUpdate status 200', async () => {
            await api.get(`/posts/${testObject.postID}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: 'Test update post',
                        shortDescription: "My update post",
                        content: "My test update content",
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
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

        it('post new deletePost status 201', async () => {
            await api.post("/posts").set('Authorization', `Basic ${testObject.basic}`)
                .send({
                    title: 'Test delete post',
                    shortDescription: "My delete post",
                    content: "My delete content",
                    blogId: testObject.blogID
                })
                .expect(201)
                .expect((res) => {
                    deletePostId = res.body.id
                })
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        title: 'Test delete post',
                        shortDescription: "My delete post",
                        content: "My delete content",
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
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

        it('delete post status 404', async () => {
            await api.delete(`/posts/${notFound}`).set('Authorization', `Basic ${testObject.basic}`)
                .expect(404)
        })

        it('delete post status 204', async () => {
            await api.delete(`/posts/${deletePostId}`).set('Authorization', `Basic ${testObject.basic}`)
                .expect(204)
        })

        it('get id postDelete status 404', async () => {
            await api.get(`/posts/${deletePostId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(404)
        })

    })
}



