import {USERS} from "../../../core/db.data";
import {ObjectId} from "mongodb";
import BcryptApp from "../../../adapters/bcrypt.adapter";
import {AuthParamsType, UserBDType, UserObjectResultType, UserReqType} from "../../../core/models";

class UserService {

    public async createUser(
        body: UserReqType,
        authParams: AuthParamsType
    ):Promise<UserObjectResultType>{
        const hushPass: string = await BcryptApp.saltGenerate(body.password)

        const userObjectId: ObjectId = new ObjectId()

        const nowDate = new Date().toISOString()

        await USERS.insertOne({
                                _id: userObjectId,
                                infUser: {
                                    login: body.login,
                                    email: body.email,
                                    createdAt: nowDate
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
        return {
                    id: userObjectId,
                    login: body.login,
                    email: body.email,
                    createdAt: nowDate
                }
    }

    public async updateUser(
        user: UserBDType,
        authParams: AuthParamsType
    ){
        await USERS.updateOne({_id: user._id}, {
            $set: {
                "activeUser.codeActivated": authParams.codeActivated,
                "activeUser.lifeTimeCode": authParams.lifeTimeCode,
                "authUser.confirm": authParams.confirm
            }
        })
    }

    public async deleteUser(
        userURIId: string
    ):Promise<boolean>{
        const bodyID: ObjectId = new ObjectId(userURIId)

        const findUser: null | UserBDType = await USERS.findOne({_id: bodyID})

        if (!findUser) {
            return false
        }

        await USERS.deleteOne({_id: bodyID})
        
        return true
    }
}

export default new UserService()
