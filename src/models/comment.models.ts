import {ObjectId} from "mongodb"
import { likesInfo } from "./likes.models"

export type commentOfPostBDType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
    createdAt: string,
    likesInfo: likesInfo
}

export type commentReqType = {
    content: string
}

export type commentAllMaps = {
    id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    createdAt: string,
    likesInfo: likesInfo
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
    createdAt: string,
    likesInfo: likesInfo
}