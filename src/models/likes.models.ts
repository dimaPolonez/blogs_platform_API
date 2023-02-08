import {ObjectId} from "mongodb"

export type likesBDType = {
    _id: ObjectId,
    user: {
        userId: ObjectId,
        login: string,
        myStatus: string
    },
    object: {
        typeId: ObjectId,
        type: string
    }
    addedAt: string
}

export type likesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type likesCounter = {
    likesCount: number,
    dislikesCount: number
}

export enum myLikeStatus {
    'None',
    'Like',
    'Dislike'
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