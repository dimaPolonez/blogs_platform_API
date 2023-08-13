import {ObjectId} from "mongodb";

export type UserBDType = {
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

export type UserReqType = {
    login: string,
    password: string,
    email: string
}

export type UserAllMapsType = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type ResultUserObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserAllMapsType []
}

export type UserObjectResultType = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}