import {ObjectId} from "mongodb";
import {Request} from "express";

export type bodyReqType<T> = Request<{}, {}, T>

export type queryReqType<T> = Request<{}, {}, {}, T>

export type paramsReqType<T> = Request<T>

export type paramsAndQueryReqType<T, Q> = Request<T, {}, {}, Q>

export type paramsId = {id: string};

export type objectId = ObjectId;

export type queryReqPagSearchAuth = {
  searchLoginTerm: string,
  searchEmailTerm: string,
  sortBy: string,
  sortDirection: string,
  pageNumber: string,
  pageSize: string
}

export type notStringQueryReqPagSearchAuth = {
  searchLoginTerm: string,
  searchEmailTerm: string,
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

export type queryReqPagOfSearchName = {
  searchNameTerm: string,
  sortBy: string,
  sortDirection: string,
  pageNumber: string,
  pageSize: string
}

export type notStringQueryReqPagOfSearchName = {
  searchNameTerm: string,
  sortBy: string,
  sortDirection:string,
  pageNumber: number,
  pageSize: number
}

export type queryReqPag = {
  sortBy: string,
  sortDirection: string,
  pageNumber: string,
  pageSize: string
}

export type notStringQueryReqPag = {
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}
