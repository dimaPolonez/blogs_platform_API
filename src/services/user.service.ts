import {ObjectId} from "mongodb";
import BcryptApp from "../application/bcrypt.application";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import {authParams} from "../models/auth.models";
import UserRepository from "../data/repository/user.repository";

class UserService {

    public async createUserAdmin(userDTO: userReqType):
        Promise<userObjectResult> 
    {
        

        const hushPass: string = await BcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = {
            confirm: true,
            codeActivated: 'Activated',
            lifeTimeCode: 'Activated'
        } 

        const createNewUser: userObjectResult = await UserRepository.createUser(hushPass, userDTO, authParams)


        

        const userObjectId: ObjectId = new ObjectId()

        const nowDate = new Date().toISOString()

        /*await USERS.insertOne({
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
                            })*/
        return {
                    id: userObjectId,
                    login: body.login,
                    email: body.email,
                    createdAt: nowDate
                }
    }

    public async createUserRegistration(userDTO: userReqType)
    {

        const authParams: authParams = await ActiveCodeApp.createCode()

        await MailerApp.sendMailCode(createdUser.email, authParams.codeActivated)

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
