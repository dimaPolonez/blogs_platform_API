import { ObjectId } from "mongodb";

export type userBDType = {
  _id: ObjectId,
  login: string,
  email: string,
  confirm: boolean,
  hushPass: string,
  createdAt: string
  }

export type userReqType = {
    login: string,
    password: string,
    email: string
  }

export type userAllMaps = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type resultUserObjectType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: userAllMaps []
}

export type userObjectResult = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}