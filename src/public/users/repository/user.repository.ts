import {USERS} from "../../../core/db.data";
import {ObjectId} from "mongodb";
import {AuthParamsType, UserBDType, UserReqType} from "../../../core/models";

class UserRepository {

    async findOne(
        userId:string
    ):Promise<UserBDType | null>{
        return await USERS.findOne({_id: new ObjectId(userId)})
    }

    async createUser(
        body: UserReqType,
        authParams: AuthParamsType,
        hushPass: string
    ):Promise<string>{

        const newUserId = new ObjectId()

        await USERS.insertOne({
            _id: newUserId,
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

        return newUserId.toString()
    }

    async deleteUser(
        userId:string
    ) {
        await USERS.deleteOne({_id: new ObjectId(userId)})
    }

}
export default new UserRepository()