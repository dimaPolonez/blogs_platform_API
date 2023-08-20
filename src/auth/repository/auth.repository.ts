import {USERS} from "../../core/db.data";
import {AuthParamsType, UserBDType, UserReqType} from "../../core/models";
import {ObjectId} from "mongodb";

class AuthRepository {

    async findOneUser(
        userId: ObjectId
    ):Promise<UserBDType | null>{
        return await USERS.findOne({_id: userId})
    }
    async findOneUserToCode(
        code: string
    ):Promise<UserBDType | null>{
       return await USERS.findOne({"activeUser.codeActivated": code})
    }
    async findOneUserLoginOrEmail(
        loginOrEmail:string
    ):Promise<UserBDType | null>{
       return await USERS.findOne(
            {
                $or: [
                    {"infUser.login": loginOrEmail},
                    {"infUser.email": loginOrEmail}
                ]
            })
    }

    async updateConfirmUser(
        userId: ObjectId,
        hushPass: string,
        authParams: AuthParamsType
    ){
        await USERS.updateOne({_id: userId}, {
            $set: {
                authUser: {confirm: authParams.confirm, hushPass: hushPass},
                activeUser: {
                    codeActivated: authParams.codeActivated,
                    lifeTimeCode: authParams.lifeTimeCode
                }
            }
        });
    }

    async updateUserPass(
        userId: ObjectId,
        authParams: AuthParamsType,
        newHashPass: string
    ){
        await USERS.updateOne({_id: userId}, {
            $set: {
                authUser: {confirm: authParams.confirm, hushPass: newHashPass},
                activeUser: {
                    codeActivated: authParams.codeActivated,
                    lifeTimeCode: authParams.lifeTimeCode
                }
            }
        })
    }

    async createUser(
        body: UserReqType,
        authParams: AuthParamsType,
        hushPass: string
    ){
        await USERS.insertOne({
            _id: new ObjectId(),
            infUser: {
                login: body.login,
                email: body.email,
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
    }

    async updateNewPass(
        userId: ObjectId,
        authParams: AuthParamsType
    ){
        await USERS.updateOne({_id: userId}, {
            $set: {
                "activeUser.codeActivated": authParams.codeActivated,
                "activeUser.lifeTimeCode": authParams.lifeTimeCode,
                "authUser.confirm": authParams.confirm
            }
        })
    }
}

export default new AuthRepository()