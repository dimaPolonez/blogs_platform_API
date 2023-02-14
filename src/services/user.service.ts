import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import BcryptApp from "../application/bcrypt.application";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import {authParams} from "../models/auth.models";

class UserService {

    public async createUser(body: userReqType):
        Promise<userObjectResult> 
    {
        const hushPass: string = await BcryptApp.saltGenerate(body.password)

        const userObjectId: ObjectId = new ObjectId()

        await USERS.insertOne({
                                _id: userObjectId,
                                infUser: {
                                    login: body.login,
                                    email: body.email,
                                    createdAt: new Date().toISOString()
                                },
                                activeUser: {
                                    codeActivated: 'Activated',
                                    lifeTimeCode: 'Activated'
                                },
                                authUser: {
                                    confirm: true,
                                    hushPass: hushPass
                                }
                            })
        return {
                    id: userObjectId,
                    login: body.login,
                    email: body.email,
                    createdAt: new Date().toISOString()
                }
    }

    public async updateUser(user: userBDType, authParams: authParams) 
    {
        await USERS.updateOne({_id: user._id}, {
            $set: {
                "activeUser.codeActivated": authParams.codeActivated,
                "activeUser.lifeTimeCode": authParams.lifeTimeCode,
                "authUser.confirm": authParams.confirm
            }
        })
    }

    public async deleteUser(userURIId: string):
        Promise<boolean> 
    {
        const bodyID: ObjectId = new ObjectId(userURIId)

        const findUser: null | userBDType = await USERS.findOne({_id: bodyID})

        if (!findUser) {
            return false
        }

        await USERS.deleteOne({_id: bodyID})
        
        return true
    }
}

export default new UserService()
