import { Schema } from "mongoose";
import { objectIpBDType } from "../../models/userSession.models";

export const guardIpBDSchema =  new Schema<objectIpBDType>({
    ip: String,
    tokens: Number,
    lastDate: Date
})