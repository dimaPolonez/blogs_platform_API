import {ObjectId} from "mongodb";
import BcryptApp from "../../adapters/bcrypt.adapter";
import {USERS} from "../../core/db.data";
import {AuthParamsType, AuthReqType, UserBDType} from "../../core/models";


class AuthService {
    public async authUser(
        body: AuthReqType
    ):Promise<null | UserBDType>{
        const findNameUser: UserBDType | null = await USERS.findOne(
            {
                $or: [
                    {"infUser.login": body.loginOrEmail},
                    {"infUser.email": body.loginOrEmail}
                ]
            })

        if (!findNameUser || !findNameUser.authUser.confirm) {
            return null
        }

        const result: boolean = await BcryptApp.hushCompare(body.password, findNameUser.authUser.hushPass)

        if (!result) {
            return null
        }

        return findNameUser
    }

    public async confirmUserEmail(
        user: UserBDType,
        authParams: AuthParamsType
    ){
        await USERS.updateOne({_id: user._id}, {
            $set: {
                authUser: {confirm: authParams.confirm, hushPass: user.authUser.hushPass},
                activeUser: {
                    codeActivated: authParams.codeActivated,
                    lifeTimeCode: authParams.lifeTimeCode
                }
            }
        });

    }

    public async updateUserPass(
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

    public async findOneUserToId(
        userId: ObjectId
    ):Promise<null | UserBDType>{
        const bodyID: ObjectId = new ObjectId (userId)

        const findUserById: UserBDType | null = await USERS.findOne({_id: bodyID})

        if (!findUserById) {
            return null
        }

        return findUserById
    }

    public async findOneUserToCode(
        code: string
    ):Promise<null | UserBDType>{
        const findUserByCode: UserBDType | null = await USERS.findOne({"activeUser.codeActivated": code})

        if (!findUserByCode) {
            return null
        }

        return findUserByCode
    }

    public async findOneUserToEmail(
        email: string
    ):Promise<null | UserBDType>{
        const findUserByEmail: UserBDType | null = await USERS.findOne({"infUser.email": email})

        if (!findUserByEmail) {
            return null
        }
        
        return findUserByEmail
    }
}

export default new AuthService()