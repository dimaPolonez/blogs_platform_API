import supertest from 'supertest'
import {TestObjectType} from "../src/core/models";



export function likeFlow(api: supertest.SuperTest<supertest.Test>, testObject: TestObjectType) {


    describe('likeFlow tests start', () => {


        let usersArray = ['User1','User2', 'User3', 'User4']
        let tokensUsersObject: string [] = []
        let commentId = ''

        usersArray.map((user) => {

            it(`post new ${user} status 201`, async () => {
                await api.post("/users").set('Authorization', `Basic ${testObject.basic}`)
                    .send({
                        login: `${user}`,
                        password: "pass1234",
                        email: `${user}@yandex.ru`
                    })
                    .expect(201)
            })

            it(`post aut ${user} and get tokens status 200`, async () => {
                await api.post("/auth/login")
                    .send({
                        loginOrEmail: `${user}`,
                        password: "pass1234"
                    })
                    .expect(200)
                    .expect((res) => {
                        tokensUsersObject.push(res.body['accessToken'])
                    })
            })
        })

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

        it(`put like Polonez of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put dislike User1 of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[0]}`)
                .send({
                    likeStatus: "Dislike"
                })
                .expect(204)
        })

        it(`put dislike User2 of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[1]}`)
                .send({
                    likeStatus: "Dislike"
                })
                .expect(204)
        })

        it(`put like User3 of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[2]}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put like User4 of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[3]}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put none User4 of comment status 204`, async () => {
            await api.put(`/comments/${commentId}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[3]}`)
                .send({
                    likeStatus: "None"
                })
                .expect(204)
        })

        it('get id comment of Polonez and statusLike Like and status 200', async () => {
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
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'Like'
                        }
                    })
                })
        })

        it('get id comment of User2 and statusLike Dislike and status 200', async () => {
            await api.get(`/comments/${commentId}`).set('Authorization', `Bearer ${tokensUsersObject[1]}`)
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
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'Dislike'
                        }
                    })
                })
        })

        it('get id comment of quest and statusLike None and status 200', async () => {
            await api.get(`/comments/${commentId}`)
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
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'None'
                        }
                    })
                })
        })

        it('get id comment of User4 and statusLike None and status 200', async () => {
            await api.get(`/comments/${commentId}`).set('Authorization', `Bearer ${tokensUsersObject[3]}`)
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
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'None'
                        }
                    })
                })
        })

        it(`put like Polonez of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put dislike User1 of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[0]}`)
                .send({
                    likeStatus: "Dislike"
                })
                .expect(204)
        })

        it(`put like User2 of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[1]}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put none User2 of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[1]}`)
                .send({
                    likeStatus: "None"
                })
                .expect(204)
        })

        it(`put like User3 of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[2]}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it(`put like User4 of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${tokensUsersObject[3]}`)
                .send({
                    likeStatus: "Like"
                })
                .expect(204)
        })

        it('get id post of Polonez and statusLike Like, and length likeArray=3 and status 200', async () => {
            await api.get(`/posts/${testObject.postID}`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: expect.any(String),
                        shortDescription: expect.any(String),
                        content: expect.any(String),
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            likesCount: 3,
                            dislikesCount: 1,
                            myStatus: 'Like',
                            newestLikes: [
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User4'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User3'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'Polonez'
                                }
                            ]
                        }
                    })
                })
        })

        it('get id post of User1 and statusLike dislike, and length likeArray=3 and status 200', async () => {
            await api.get(`/posts/${testObject.postID}`).set('Authorization', `Bearer ${tokensUsersObject[0]}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: expect.any(String),
                        shortDescription: expect.any(String),
                        content: expect.any(String),
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            likesCount: 3,
                            dislikesCount: 1,
                            myStatus: 'Dislike',
                            newestLikes: [
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User4'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User3'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'Polonez'
                                }
                            ]
                        }
                    })
                })
        })

        it(`put dislike Polonez of post status 204`, async () => {
            await api.put(`/posts/${testObject.postID}/like-status`).set('Authorization', `Bearer ${testObject.accessToken}`)
                .send({
                    likeStatus: "Dislike"
                })
                .expect(204)
        })

        it('get id post of User2 and statusLike none, and length likeArray=2 and status 200', async () => {
            await api.get(`/posts/${testObject.postID}`).set('Authorization', `Bearer ${tokensUsersObject[1]}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: expect.any(String),
                        shortDescription: expect.any(String),
                        content: expect.any(String),
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'None',
                            newestLikes: [
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User4'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User3'
                                }
                            ]
                        }
                    })
                })
        })

        it('get id post of quest and statusLike none, and length likeArray=2 and status 200', async () => {
            await api.get(`/posts/${testObject.postID}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: testObject.postID,
                        title: expect.any(String),
                        shortDescription: expect.any(String),
                        content: expect.any(String),
                        blogId: testObject.blogID,
                        blogName: expect.any(String),
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            likesCount: 2,
                            dislikesCount: 2,
                            myStatus: 'None',
                            newestLikes: [
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User4'
                                },
                                {
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: 'User3'
                                }
                            ]
                        }
                    })
                })
        })


    })
}