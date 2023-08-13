import {userObjectResult, userReqAuthBody, userReqType} from "../models/user.models";
import {authParams} from "../models/userAuth.models";
import {bcryptApp} from "../application/bcrypt.application";
import {userRepository} from "../data/repository/user.repository";
import {activateCodeApp} from "../application/codeActive.application";
import {mailerApp} from "../application/mailer.application";

class UserService {

    public async createUserAdmin(userDTO: userReqType):
        Promise<userObjectResult> {
        const hushPass: string = await bcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = {
            confirm: true,
            codeActivated: 'Activated',
            lifeTimeCode: 'Activated'
        }

        const createNewUser: userObjectResult = await userRepository.createUser(hushPass, userDTO, authParams)

        return createNewUser
    }

    public async createUserRegistration(userDTO: userReqType) {
        const hushPass: string = await bcryptApp.saltGenerate(userDTO.password)

        const authParams: authParams = await activateCodeApp.createCode()

        const createNewUser: userObjectResult = await userRepository.createUser(hushPass, userDTO, authParams)

        await mailerApp.sendMailCode(createNewUser.email, authParams.codeActivated)
    }


    public async updateUser(userDTO: userReqAuthBody) {
        const findUser: null | userObjectResult = await userRepository.findOneByEmail(userDTO.email)

        if (findUser) {
            const authParams: authParams = await activateCodeApp.createCode()

            await userRepository.updateUser(findUser.id.toString(), authParams)

            await mailerApp.sendMailPass(userDTO.email, authParams.codeActivated)
        }
    }

    public async deleteUser(userID: string):
        Promise<boolean> {
        const updatedUserResult: boolean = await userRepository.deleteUser(userID)

        return updatedUserResult
    }
}

export const userService = new UserService()
