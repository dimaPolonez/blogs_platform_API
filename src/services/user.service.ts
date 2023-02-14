import {USERS} from "../data/db.data";
import {ObjectId} from "mongodb";
import bcryptApplication from "../application/bcrypt.application";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import {authParams} from "../models/auth.models";

class UserService {

    public async createUser(body: userReqType, authParams: authParams):
        Promise<userObjectResult> 
    {
        const hushPass: string = await bcryptApplication.saltGenerate(body.password)

        const userObjectId: ObjectId = new ObjectId();

        await USERS.insertOne({
                                _id: userObjectId,
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
                            });
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

    public async deleteUser(bodyID: ObjectId):
        Promise<boolean> 
    {
        const findUser: null | userBDType = await USERS.findOne({_id: bodyID});

        if (!findUser) {
            return false;
        }

        await USERS.deleteOne({_id: bodyID});
        
        return true
    }
}

export default new UserService();
