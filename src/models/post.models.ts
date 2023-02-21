import {ObjectId} from "mongodb";
import { likesInfoPost} from "./likes.models";

export type postBDType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: likesInfoPost
}

export type postReqType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type postOfBlogReqType = {
    title: string,
    shortDescription: string,
    content: string
}

export type postAllMaps = {
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: likesInfoPost
}

export type resultPostObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postAllMaps []
}

export type postObjectResult = {
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: likesInfoPost
}