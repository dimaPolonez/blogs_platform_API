import {ObjectId} from "mongodb";
import {LikesInfoPostType} from "./likes.models";

export type PostBDType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: LikesInfoPostType
}

export type PostReqType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId
}

export type PostOfBlogReqType = {
    title: string,
    shortDescription: string,
    content: string
}

export type PostAllMapsType = {
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: LikesInfoPostType
}

export type ResultPostObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostAllMapsType []
}

export type PostObjectResultType = {
    id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: LikesInfoPostType
}