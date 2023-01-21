import {ObjectId} from "mongodb"
import {userBDType} from "./user.models"

declare global {
    namespace Express {
        export interface Request {
            user: userBDType
        }
    }
}

export type authReqType = {
    loginOrEmail: string,
    password: string
}

export type tokenObjectType = {
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