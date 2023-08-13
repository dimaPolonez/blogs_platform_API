import {ObjectId} from "mongodb"

export type LikesBDType = {
    _id: ObjectId,
    user: {
        userId: ObjectId,
        login: string,
        myStatus: myLikeStatus
    },
    object: {
        typeId: ObjectId,
        type: string
    }
    addedAt: string
}

export type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type LikesInfoPostType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: NewestLikesType []
}

export type NewestLikesType = {
    addedAt: string,
    userId: ObjectId,
    login: string
}

export type LikesCounterType = {
    likesCount: number,
    dislikesCount: number
}

export enum myLikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type LikesReqType = {
    likeStatus: string
}

export type CountObjectType = {
    typeId: ObjectId,
    type: string,
    likesCount: number,
    dislikesCount: number
}