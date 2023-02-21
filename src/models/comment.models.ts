import {ObjectId} from "mongodb"
import {likesInfo} from "./likes.models"

export type commentOfPostBDType = {
    _id: ObjectId,
    content: string,
    commentatorInfo: commInfo,
    postId: ObjectId,
    createdAt: string,
    likesInfo: likesInfo
}

export type commInfo = {
    userId: ObjectId,
    userLogin: string
}

export type commentReqType = {
    content: string
}

export type commentDTOAll = {
    content: string,
    commentatorInfo: commInfo,
    postId: string
}

export type commentAllMaps = {
    id: ObjectId,
    content: string,
    commentatorInfo: commInfo,
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
    commentatorInfo: commInfo,
    createdAt: string,
    likesInfo: likesInfo
}