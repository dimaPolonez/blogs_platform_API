import {ObjectId} from "mongodb"
import {userBDType} from "./user.models"

declare global {
    namespace Express {
        export interface Request {
            userId: ObjectId | null,
            user: userBDType,
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