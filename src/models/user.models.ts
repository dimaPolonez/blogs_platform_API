import { ObjectId } from "mongodb";

export type userBDType = {
  _id: ObjectId,
  login: string,
  email: string,
  hushPass: string,
  createdAt: string
  }

export type userReqType = {
    login: string,
    password: string,
    email: string
  }