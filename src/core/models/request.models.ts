import {Request} from "express";

export type BodyReqType<T> = Request<{}, {}, T>

export type QueryReqType<T> = Request<{}, {}, {}, T>

export type ParamsReqType<T> = Request<T>

export type ParamsAndBodyReqType<T, Q> = Request<T, {}, Q>

export type ParamsAndQueryReqType<T, Q> = Request<T, {}, {}, Q>

export type ParamsIdType = { id: string };

export type QueryReqPagSearchAuthType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string
}

export type NotStringQueryReqPagSearchAuthType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

export type QueryReqPagOfSearchNameType = {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string
}

export type NotStringQueryReqPagOfSearchNameType = {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

export type QueryReqPagType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string
}

export type NotStringQueryReqPagType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

export type TestObjectType = {
    basic: string,
    accessToken: string,
    refreshToken: string,
    userID: string,
    blogID: string,
    postID: string
}

