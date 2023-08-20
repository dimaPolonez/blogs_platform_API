import supertest from 'supertest'
import {TestObjectType} from "../src/core/models";



export function commentFlow(api: supertest.SuperTest<supertest.Test>, testObject: TestObjectType) {


    describe('commentFlow tests start', () => {

        let deleteCommentId: string = ''
        let commentId: string = ''
        let notFound: string = '63f0e789e8f1762c4ba45f3e'

        it('post new comment by id post status 201', async () => {
            await api.post(`/posts/${testObject.postID}/comments`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    content: "My test content by comment"
                })
                .expect(201)
                .expect((res) => {
                    commentId = res.body.id
                })
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        content: "My test content by comment",
                        commentatorInfo: {
                            userId: testObject.userID,
                            userLogin: "Polonez"
                        },
                        createdAt: expect.any(String),
                        likesInfo: {
                            likesCount: expect.any(Number),
                            dislikesCount: expect.any(Number),
                            myStatus: expect.any(String)
                        }
                    })
                })
        })

        it('get id comment status 200', async () => {
            await api.get(`/comments/${commentId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: commentId,
                        content: "My test content by comment",
                        commentatorInfo: {
                            userId: testObject.userID,
                            userLogin: "Polonez"
                        },
                        createdAt: expect.any(String),
                        likesInfo: {
                            likesCount: expect.any(Number),
                            dislikesCount: expect.any(Number),
                            myStatus: expect.any(String)
                        }
                    })
                })
        })

        it('put id comment status 404', async () => {
            await api.put(`/comments/${notFound}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    content: "My test update content"
                })
                .expect(404)
        })

        it('put id comment status 204', async () => {
            await api.put(`/comments/${commentId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    content: "My test update content"
                })
                .expect(204)
        })

        it('get id commentUpdate status 200', async () => {
            await api.get(`/comments/${commentId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: commentId,
                        content: "My test update content",
                        commentatorInfo: {
                            userId: testObject.userID,
                            userLogin: "Polonez"
                        },
                        createdAt: expect.any(String),
                        likesInfo: {
                            likesCount: expect.any(Number),
                            dislikesCount: expect.any(Number),
                            myStatus: expect.any(String)
                        }
                    })
                })
        })

        it('post new deleteComment by id post status 201', async () => {
            await api.post(`/posts/${testObject.postID}/comments`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    content: "My test content by deleteComment"
                })
                .expect(201)
                .expect((res) => {
                    deleteCommentId = res.body.id
                })
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        content: "My test content by deleteComment",
                        commentatorInfo: {
                            userId: testObject.userID,
                            userLogin: "Polonez"
                        },
                        createdAt: expect.any(String),
                        likesInfo: {
                            likesCount: expect.any(Number),
                            dislikesCount: expect.any(Number),
                            myStatus: expect.any(String)
                        }
                    })
                })
        })

        it('delete comment status 404', async () => {
            await api.delete(`/comments/${notFound}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(404)
        })

        it('delete blog status 204', async () => {
            await api.delete(`/comments/${deleteCommentId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(204)
        })

        it('get id postDelete status 404', async () => {
            await api.get(`/posts/${deleteCommentId}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(404)
        })

    })
}