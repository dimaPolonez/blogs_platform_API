import {ObjectId} from "mongodb"
import {LikesInfoType} from "./likes.models"

export type CommentOfPostBDType = {
    _id: ObjectId,
    content: string,
    commentatorInfo: CommInfoType,
    postId: ObjectId,
    createdAt: string,
    likesInfo: LikesInfoType
}

export type CommInfoType = {
    userId: ObjectId,
    userLogin: string
}

export type CommentReqType = {
    content: string
}

export type CommentAllMapsType = {
    id: ObjectId,
    content: string,
    commentatorInfo: CommInfoType,
    createdAt: string,
    likesInfo: LikesInfoType
}

export type ResultCommentObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentAllMapsType []
}

export type CommentObjectResultType = {
    id: ObjectId,
    content: string,
    commentatorInfo: CommInfoType,
    createdAt: string,
    likesInfo: LikesInfoType
}