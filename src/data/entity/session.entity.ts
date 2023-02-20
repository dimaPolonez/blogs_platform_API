import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { sessionBDType } from "../../models/session.models";

export const sessionBDSchema =  new Schema<sessionBDType>({
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    expiresTime: String
})