import {ObjectId} from "mongodb"
import {UserBDType} from "./user.models";

declare global {
    namespace Express {
        export interface Request {
            userId: ObjectId | null,
            user: UserBDType,
            sessionId: ObjectId
        }
    }
}

export type AuthReqType = {
    loginOrEmail: string,
    password: string
}

export type TokensObjectType = {
    accessToken: string
}

export type TokensObjectFullType = {
    accessToken: string,
    refreshToken: string
}

export type AuthMeType = {
    email: string,
    login: string,
    userId: ObjectId
}

export type AuthParamsType = {
    confirm: boolean,
    codeActivated: string,
    lifeTimeCode: string
}