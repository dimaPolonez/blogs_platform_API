import BcryptApp from "../application/bcrypt.application";
import ActiveCodeApp from "../application/codeActive.application";
import MailerApp from "../application/mailer.application";
import { sessionsUserType, userBDType, userObjectResult, userReqAuthBody, userReqType } from "../models/user.models";
import { authParams } from "../models/auth.models";
import { returnRefreshObject } from "../models/session.models";
import { userRepository } from "../data/repository/user.repository";
import { UserModel } from "../data/entity/user.entity";
import { ObjectId } from "mongodb";
import { isAfter } from "date-fns";

class UserService {

    public async createUserAdmin(userDTO: userReqType):
        Promise<userObjectResult> {
        const hushPass: string = await BcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = {
            confirm: true,
            codeActivated: 'Activated',
            lifeTimeCode: 'Activated'
        }

        const createNewUser: userObjectResult = await userRepository.createUser(hushPass, userDTO, authParams)

        return createNewUser
    }

    public async createUserRegistration(userDTO: userReqType) {
        const hushPass: string = await BcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = await ActiveCodeApp.createCode()

        const createNewUser: userObjectResult = await userRepository.createUser(hushPass, userDTO, authParams)

        await MailerApp.sendMailCode(createNewUser.email, authParams.codeActivated)
    }


    public async updateUser(userDTO: userReqAuthBody) {
        const findUser: null | userObjectResult = await userRepository.findOneByEmail(userDTO.email)

        if (findUser) {
            const authParams: authParams = await ActiveCodeApp.createCode()

            await userRepository.updateUser(findUser.id.toString(), authParams)

            await MailerApp.sendMailPass(userDTO.email, authParams.codeActivated)
        }
    }

    public async checkedActiveSession(refreshObject: returnRefreshObject):
        Promise<boolean> {

        const objectUserID: ObjectId = new ObjectId(refreshObject.userId)

        const findUser: null | userBDType = await UserModel.findOne({ _id: objectUserID })

        if (!findUser){
            return false
        }

        const findSession: boolean[] = findUser.sessionsUser.map((activeSession: sessionsUserType) => {
            
            if (activeSession.idSession === refreshObject.sessionId) {

                const date = Date.parse(activeSession.expiresTime)
                
                if (!(isAfter(date, new Date()))){
                    return false
                }

                return true
            }
             
            return false
        })

        if (!findSession[0]) {
            return false
        }

        return true
    }

    public async deleteUser(userID: string):
        Promise<boolean> {
        const updatedUserResult: boolean = await userRepository.deleteUser(userID)

        return updatedUserResult
    }
}

export const userService = new UserService()
