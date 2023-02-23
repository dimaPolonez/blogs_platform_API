import mongoose, { Model, Schema } from "mongoose";
import { sessionsUserType, userBDType, userReqType } from "../../models/user.models";
import {authParams} from "../../models/auth.models";

type UserStaticType = Model<userBDType> & {
    createUser(hushPass: string, userDTO:userReqType, authParams: authParams): any,
    updateUser(userID: string, authParams: authParams): boolean,
    updatePasswordUser(userID: string, authParams: authParams, newHashPass: string): boolean
}

export const sessionsUserSchema = new Schema<sessionsUserType>({
    idSession: String,
    ip: String,
    title: String,
    expiresTime: String,
    lastActivateTime: String
})

export const userBDSchema =  new Schema<userBDType, UserStaticType>({
    infUser: {
        login: String,
        hushPass: String,
        email: String,
        createdAt: String
    },
    activeUser: {
        codeActivated: String,
        lifeTimeCode: String,
        confirm: Boolean,
    },
    sessionsUser: [sessionsUserSchema]
})


/* userBDSchema.static({async createUser(hushPass: string, userDTO:userReqType, authParams: authParams):
    Promise<any> {

    const newUserSmart = new UserModel({
        infUser: {
            login: userDTO.login,
            email: userDTO.email,
            createdAt: new Date().toISOString()
        },
        activeUser: {
            codeActivated: authParams.codeActivated,
            lifeTimeCode: authParams.lifeTimeCode
        },
        authUser: {
            confirm: authParams.confirm,
            hushPass: hushPass
        }
    })

    await UserRepository.save(newUserSmart)

    return newUserSmart
}
}) */

/* userBDSchema.static({async updateUser(userID: string, authParams: authParams):
    Promise<boolean> {

        const findUserDocument = await UserRepository.findOneByIdReturnDoc(userID)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.activeUser.codeActivated = authParams.codeActivated
        findUserDocument.activeUser.lifeTimeCode = authParams.lifeTimeCode
        findUserDocument.authUser.confirm = authParams.confirm

        await UserRepository.save(findUserDocument)

        return true
}
}) */

/* userBDSchema.static({async updatePasswordUser(userID: string, authParams: authParams, newHashPass: string):
    Promise<boolean> {

        const findUserDocument = await UserRepository.findOneByIdReturnDoc(userID)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.activeUser.codeActivated = authParams.codeActivated
        findUserDocument.activeUser.lifeTimeCode = authParams.lifeTimeCode
        findUserDocument.authUser.confirm = authParams.confirm
        findUserDocument.authUser.hushPass = newHashPass

        await UserRepository.save(findUserDocument)

        return true
}
}) */

export const UserModel = mongoose.model<userBDType, UserStaticType>('users', userBDSchema)