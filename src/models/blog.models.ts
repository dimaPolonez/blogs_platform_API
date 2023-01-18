import { ObjectId } from "mongodb";

export type blogBDType = {
        _id: ObjectId,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: string
    }

export type blogReqType = {
        name: string,
        description: string,
        websiteUrl: string
    }

export type blogAllMaps = {
        id: ObjectId,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: string
    }

export type resultBlogObjectType = {
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: blogAllMaps []
    }