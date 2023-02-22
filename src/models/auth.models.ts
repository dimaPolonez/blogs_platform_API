import {ObjectId} from "mongodb"
import {userBDType} from "./user.models"

declare global {
    namespace Express {
        export interface Request {
            userID: string,
            user: userBDType,
            sessionId: ObjectId
        }
    }
}

export type authReqType = {
    loginOrEmail: string,
    password: string
}

export type tokensObjectType = {
    accessToken: string
}

export type authMeType = {
    email: string,
    login: string,
    userId: ObjectId
}

export type authParams = {
    confirm: boolean,
    codeActivated: string,
    lifeTimeCode: string
}