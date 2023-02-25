import mongoose, {Model, Schema} from "mongoose";
import {userBDType, userReqType} from "../../models/user.models";
import {authParams} from "../../models/auth.models";
import {userRepository} from "../repository/user.repository";

type UserStaticType = Model<userBDType> & {
    createUser(hushPass: string, userDTO: userReqType, authParams: authParams): any,
    updateUser(userID: string, authParams: authParams): boolean,
    updatePasswordUser(userID: string, authParams: authParams, newHashPass: string): boolean
}

export const userBDSchema = new Schema<userBDType, UserStaticType>({
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


userBDSchema.static({
    async createUser(hushPass: string, userDTO: userReqType, authParams: authParams):
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

        await userRepository.save(newUserSmart)

        return newUserSmart
    }
})

userBDSchema.static({
    async updateUser(userID: string, authParams: authParams):
        Promise<boolean> {

        const findUserDocument = await userRepository.findOneByIdReturnDoc(userID)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.activeUser.codeActivated = authParams.codeActivated
        findUserDocument.activeUser.lifeTimeCode = authParams.lifeTimeCode
        findUserDocument.authUser.confirm = authParams.confirm

        await userRepository.save(findUserDocument)

        return true
    }
})

userBDSchema.static({
    async updatePasswordUser(userID: string, authParams: authParams, newHashPass: string):
        Promise<boolean> {

        const findUserDocument = await userRepository.findOneByIdReturnDoc(userID)

        if (!findUserDocument) {
            return false
        }

        findUserDocument.activeUser.codeActivated = authParams.codeActivated
        findUserDocument.activeUser.lifeTimeCode = authParams.lifeTimeCode
        findUserDocument.authUser.confirm = authParams.confirm
        findUserDocument.authUser.hushPass = newHashPass

        await userRepository.save(findUserDocument)

        return true
    }
})

export const UserModel = mongoose.model<userBDType, UserStaticType>('users', userBDSchema)