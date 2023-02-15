import {ObjectId} from "mongodb";
import BcryptApp from "../application/bcrypt.application";
import {USERS} from "../data/db.data";
import {authParams, authReqType} from "../models/auth.models";
import {userBDType} from "../models/user.models";


class AuthService {

    public async authUser(body: authReqType):
        Promise<null | userBDType> 
    {
        const findNameUser: userBDType | null = await USERS.findOne(
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

    public async confirmUserEmail(user: userBDType, authParams: authParams)
    {
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

    public async updateUserPass(userId: ObjectId, authParams: authParams, newHashPass: string) 
    {
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

    public async findOneUserToId(userId: ObjectId):
        Promise<null | userBDType> 
    {
        const bodyID: ObjectId = new ObjectId (userId)
        const findUserById: userBDType | null = await USERS.findOne({_id: bodyID})

        if (!findUserById) {
            return null
        }

        return findUserById
    }

    public async findOneUserToCode(code: string):
        Promise<null | userBDType> 
    {
        const findUserByCode: userBDType | null = await USERS.findOne({"activeUser.codeActivated": code})

        if (!findUserByCode) {
            return null
        }

        return findUserByCode
    }

    public async findOneUserToEmail(email: string):
        Promise<null | userBDType> 
    {
        const findUserByEmail: userBDType | null = await USERS.findOne({"infUser.email": email})

        if (!findUserByEmail) {
            return null
        }
        
        return findUserByEmail
    }
}

export default new AuthService()