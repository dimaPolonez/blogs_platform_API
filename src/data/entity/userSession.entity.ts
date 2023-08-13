import {ObjectId} from "mongodb";
import {Schema} from "mongoose";
import {sessionBDType} from "../../models/userSession.models";

export const sessionBDSchema = new Schema<sessionBDType>({
    userId: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    expiresTime: String
})