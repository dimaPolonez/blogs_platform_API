import { Schema } from "mongoose";
import { objectIpBDType } from "../../models/session.models";

export const objectIpBDSchema =  new Schema<objectIpBDType>({
    ip: String,
    tokens: Number,
    lastDate: Date
})