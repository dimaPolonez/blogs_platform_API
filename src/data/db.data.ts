import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import {objectIpBDSchema} from './entity/objectIP.entity';
import {sessionBDSchema} from './entity/session.entity';

dotenv.config()


export const settings = {
    DB_URL: process.env.mongoURI || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWTREFRESH_SECRET: process.env.JWT_SECRET || '456',
    MAIL_URL_USER: process.env.MAIL_URL_USER,
    MAIL_URL_PASS: process.env.MAIL_URL_PASS
}

export async function startBD() {
    try {
        mongoose.set("strictQuery", true)

        await mongoose.connect(settings.DB_URL)

        console.log('Connected successfully to mongo server')

    } catch {
        await mongoose.disconnect();
    }
}

export const ACTIVE_DEVICE = mongoose.model('refreshTokensActive', sessionBDSchema)
export const OBJECT_IP = mongoose.model('objectIP', objectIpBDSchema)

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