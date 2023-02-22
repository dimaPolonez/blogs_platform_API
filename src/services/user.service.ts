import BcryptApp from "../application/bcrypt.application";
import ActiveCodeApp from "../application/codeActive.application";
import MailerApp from "../application/mailer.application";
import {userObjectResult, userReqAuthBody, userReqType} from "../models/user.models";
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

        return createNewUser
    }

    public async createUserRegistration(userDTO: userReqType)
    {
        const hushPass: string = await BcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = await ActiveCodeApp.createCode()

        const createNewUser: userObjectResult = await UserRepository.createUser(hushPass, userDTO, authParams)
        
        await MailerApp.sendMailCode(createNewUser.email, authParams.codeActivated)
    }


    public async updateUser(userDTO: userReqAuthBody) 
    {
        const findUser: null | userObjectResult = await UserRepository.findOneByEmail(userDTO.email)

        if (findUser) {
            const authParams: authParams = await ActiveCodeApp.createCode()

            await UserRepository.updateUser(findUser.id.toString(), authParams)

            await MailerApp.sendMailPass(userDTO.email, authParams.codeActivated)
        }
    }

    public async deleteUser(userID: string):
        Promise<boolean> 
    {
        const updatedUserResult: boolean = await UserRepository.deleteUser(userID)
        
        return updatedUserResult
    }
}

export default new UserService()
