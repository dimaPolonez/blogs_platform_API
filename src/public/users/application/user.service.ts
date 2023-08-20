import BcryptApp from "../../../adapters/bcrypt.adapter";
import {AuthParamsType, UserBDType, UserReqType} from "../../../core/models";
import userRepository from "../repository/user.repository";
import UserRepository from "../repository/user.repository";

class UserService {

    public async createUser(
        body: UserReqType,
    ):Promise<string>{
        const hushPass: string = await BcryptApp.saltGenerate(body.password)

        const authParams: AuthParamsType = {
            confirm: true,
            codeActivated: 'Activated',
            lifeTimeCode: 'Activated'
        }

        return await userRepository.createUser(body, authParams, hushPass)
    }

    public async deleteUser(
        userId: string
    ):Promise<boolean>{
        const findUser: UserBDType | null = await UserRepository.findOne(userId)

        if (!findUser) {
            return false
        }

        await userRepository.deleteUser(userId)
        return true
    }
}

export default new UserService()
