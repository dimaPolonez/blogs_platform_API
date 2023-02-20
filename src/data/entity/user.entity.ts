import { Schema } from "mongoose";
import { userBDType } from "../../models/user.models";

export const userBDSchema =  new Schema<userBDType>({
    infUser: {
        login: String,
        email: String,
        createdAt: String
    },
    activeUser: {
        codeActivated: String,
        lifeTimeCode: String,
    },
    authUser: {
        confirm: Boolean,
        hushPass: String
    }
})