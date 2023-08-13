import {ObjectId} from "mongodb";

export type BlogBDType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}

export type BlogReqType = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogAllMapsType = {
    id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}

export type ResultBlogObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogAllMapsType []
}

export type BlogObjectResultType = {
    id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
}