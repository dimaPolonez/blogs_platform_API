import { ObjectId } from "mongodb";


export type resfreshTokenBDType = {
    _id: ObjectId,
    token: string,
    expired: string,
}