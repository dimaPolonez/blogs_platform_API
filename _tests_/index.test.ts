import supertest from 'supertest'
import { app } from '../src';
import jwt from 'jsonwebtoken';
import { settings } from '../src/data/db.data';
import { blogFlow } from './blog.test';
import { postFlow } from './post.test';
import {commentFlow} from "./comments.test";
import {likeFlow} from "./like.test";
import {TestObjectType} from "../src/models";

const api = supertest(app)

const testObject: TestObjectType = {
    basic: 'YWRtaW46cXdlcnR5',
    accessToken: ' ',
    refreshToken: ' ',
    userID: ' ',
    blogID: ' ',
    postID: ' '
}


it('server start', async () => {
    await api.get('/')
        .expect(200)
})

it('clear base', async () => {
    await api.delete("/testing/all-data")
        .expect(204)

})

jest.setTimeout(10000)

describe('start base tests', () => {

    it('post new user status 201', async () => {
        await api.post("/users").set('Authorization', `Basic ${testObject.basic}`)
            .send({
                login: 'Polonez',
                password: "pass1234",
                email: "testPolonez@yandex.ru"
            })
            .expect(201)
    })

    it('post aut user and get tokens status 200', async () => {
        await api.post("/auth/login")
            .send({
                loginOrEmail: 'Polonez',
                password: "pass1234"
            })
            .expect(200)
            .expect((res) => {
                testObject.accessToken = res.body['accessToken']
                testObject.refreshToken = res.headers['set-cookie'][0]
                const validAccess: any = jwt.verify(testObject.accessToken, settings.JWT_SECRET)
                testObject.userID = validAccess.userId
            })
    })

    it('post new blog status 201', async () => {
        await api.post("/blogs").set('Authorization', `Basic ${testObject.basic}`)
            .send({
                name: 'Test blog',
                description: "My test blog",
                websiteUrl: "polonezTestBlog.com"
            })
            .expect(201)
            .expect((res) => {
                testObject.blogID = res.body.id
            })
            .then((res) => {
                expect(res.body).toEqual({
                    id: expect.any(String),
                    name: 'Test blog',
                    description: "My test blog",
                    websiteUrl: "polonezTestBlog.com",
                    createdAt: expect.any(String)
                })
            })
    })

    it('post new post status 201', async () => {
        await api.post("/posts").set('Authorization', `Basic ${testObject.basic}`)
            .send({
                title: 'Test post',
                shortDescription: "My test post",
                content: "My test content",
                blogId: testObject.blogID
            })
            .expect(201)
            .expect((res) => {
                testObject.postID = res.body.id
            })
            .then((res) => {
                expect(res.body).toEqual({
                    id: expect.any(String),
                    title: 'Test post',
                    shortDescription: "My test post",
                    content: "My test content",
                    blogId: testObject.blogID,
                    blogName: 'Test blog',
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

})

//blogFlow(api, testObject)

//postFlow(api, testObject)

//commentFlow(api, testObject)

//likeFlow(api,testObject)