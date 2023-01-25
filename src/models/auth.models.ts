import {ObjectId} from "mongodb"
import {req_user_token} from "./user.models"

declare global {
    namespace Express {
        export interface Request {
            user: req_user_token
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