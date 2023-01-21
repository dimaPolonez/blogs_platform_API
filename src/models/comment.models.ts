import {ObjectId} from "mongodb"

export type commentOfPostBDType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
    createdAt: string
}

export type commentReqType = {
    content: string
}

export type commentAllMaps = {
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    createdAt: string
}

export type resultCommentObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: commentAllMaps []
}

export type commentObjectResult = {
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    createdAt: string
}