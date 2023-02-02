import {MongoClient} from 'mongodb';
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import {blogBDType} from '../models/blog.models';
import {postBDType} from '../models/post.models';
import {userBDType} from '../models/user.models';
import {commentOfPostBDType} from '../models/comment.models';
import {activeDeviceBDType, objectIP} from "../models/activeDevice.models";

dotenv.config();

export const settings = {
    DB_URL: process.env.mongoURI || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWTREFRESH_SECRET: process.env.JWT_SECRET || '456',
    MAIL_URL_USER: process.env.MAIL_URL_USER,
    MAIL_URL_PASS: process.env.MAIL_URL_PASS
}

export const client = new MongoClient(settings.DB_URL);

export async function startBD() {
    try {
        await client.connect();
        await client.db('blogs_platform_API').command({ping: 1});
        console.log('Connected successfully to mongo server');
    } catch {
        await client.close();
    }
}

const db: mongoDB.Db = client.db(process.env.DB_NAME);
export const BLOGS = db.collection<blogBDType>('blogs');
export const POSTS = db.collection<postBDType>('posts');
export const USERS = db.collection<userBDType>('users');
export const COMMENTS = db.collection<commentOfPostBDType>('comments');
export const ACTIVE_DEVICE = db.collection<activeDeviceBDType>('refreshTokensActive');
export const OBJECT_IP = db.collection<objectIP>('objectIP');

export const ERRORS_CODE = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_YOUR_OWN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MANY_REQUEST_429: 429,
    INTERNAL_SERVER_ERROR_500: 500
}

export let SUPERADMIN = [
    {
        id: "1",
        logPass: "YWRtaW46cXdlcnR5",
    }
]
