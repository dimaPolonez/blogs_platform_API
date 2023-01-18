import { ObjectId } from "mongodb"

export type commentOfPostBDType = {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    postId: ObjectId,
    createdAt: string
    }

export type commentReqType = {
    content: string
}