import {ObjectId} from "mongodb";
import { tokensObjectType } from "./auth.models";

export type userBDType = {
    _id: ObjectId,
    infUser: {
        login: string,
        email: string,
        createdAt: string
    },
    activeUser: {
        codeActivated: string,
        lifeTimeCode: string,
    },
    authUser: {
        confirm: boolean,
        hushPass: string
    }
}

export type req_user_token = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
    accessToken: tokensObjectType
}

export type userReqType = {
    login: string,
    password: string,
    email: string
}

export type userAllMaps = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type resultUserObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: userAllMaps []
}

export type userObjectResult = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}