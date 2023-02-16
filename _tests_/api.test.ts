import supertest from 'supertest'
import {app} from '../src';
import { blogTest } from './blog.test';
import jwt from 'jsonwebtoken';
import { settings } from '../src/data/db.data';

const api = supertest(app)

describe('/', () => {

    let accessToken = ''
    let refreshToken = ''
    let validAccess: any = ''
    let basic = 'YWRtaW46cXdlcnR5'

    it('server start', async () => {
        await api.get('/')
            .expect(200)
    })

    it('clear base', async () => {
        await api.delete("/testing/all-data")
        .expect(204)
    })

    it('create new user', async () => {
        await api.post("/users").set('Authorization', `Basic ${basic}`)
        .send({
            login: 'Polonez',
            password: "pass1234",
            email: "testPolonez@yandex.ru"
        })
        .expect(201)
    })

    it('aut user and get tokens', async () => {
        await api.post("/auth/login")
        .send({
            loginOrEmail: 'Polonez',
            password: "pass1234"
        })
        .expect(200)
        .expect((res) => {
            accessToken = res.body['accessToken']
            refreshToken = res.headers['set-cookie'][0]
            validAccess = jwt.verify(accessToken, settings.JWT_SECRET)
           })
    })

    it('get ME information', async () => {
        await api.get("/auth/me").set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect({userId: validAccess.userId,
            email: 'testPolonez@yandex.ru',
            login: 'Polonez'
            })
    })

    blogTest(accessToken, refreshToken, basic)

    
})
