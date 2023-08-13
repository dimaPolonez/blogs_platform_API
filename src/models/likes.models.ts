import {ObjectId} from "mongodb"
import {tokensObjectType} from "./userAuth.models"

export type likesBDType = {
    _id: ObjectId,
    user: {
        userId: ObjectId,
        login: string,
        myStatus: myLikeStatus
    },
    object: {
        typeId: ObjectId,
        type: string
    },
    addedAt: string
}

export type likesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type likesInfoPost = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: newestLikes []
}

export type newestLikes = {
    addedAt: string,
    userId: ObjectId,
    login: string
}

export type tokensReturn = {
    refreshToken: string,
    accessToken: tokensObjectType,
    optionsCookie: {
        httpOnly: boolean,
        secure: boolean
    }
}

export type likesCounter = {
    likesCount: number,
    dislikesCount: number
}

export enum myLikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type likesReq = {
    likeStatus: string
}

export type countObject = {
    typeId: ObjectId,
    type: string,
    likesCount: number,
    dislikesCount: number
}