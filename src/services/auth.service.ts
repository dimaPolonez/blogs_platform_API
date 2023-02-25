import {ObjectId} from "mongodb";
import {authParams, authReqType, tokensObjectType} from "../models/auth.models";
import {tokensReturn} from "../models/likes.models";
import {deviceInfoObject} from "../models/session.models";
import {userBDType, userReqPass} from "../models/user.models";
import {userRepository} from "../data/repository/user.repository";
import {bcryptApp} from "../application/bcrypt.application";
import {jwtApp} from "../application/jwt.application";
import {activateCodeApp} from "../application/codeActive.application";
import {mailerApp} from "../application/mailer.application";

const authParams: authParams = {
    confirm: true,
    codeActivated: 'Activated',
    lifeTimeCode: 'Activated'
}

class AuthService {

    public async authUser(authDTO: authReqType, deviceInfo: deviceInfoObject):
        Promise<null | tokensReturn> {
        const findUser: null | userBDType = await userRepository.findOneByLoginOrEmail(authDTO.loginOrEmail)

        if (!findUser || !findUser.authUser.confirm) {
            return null
        }

        const validPassword: boolean = await bcryptApp.hushCompare(authDTO.password, findUser.authUser.hushPass)

        if (!validPassword) {
            return null
        }

        const refreshToken: string = await jwtApp.createRefreshJwt(findUser._id, deviceInfo)

        const accessToken: tokensObjectType = await jwtApp.createAccessJwt(findUser._id)

        const tokensObject: tokensReturn = {
            refreshToken: refreshToken,
            accessToken: accessToken,
            optionsCookie: {
                httpOnly: true,
                secure: true
            }
        }

        return tokensObject
    }

    public async newTokens(userID: string, deviceInfo: deviceInfoObject, sessionID: ObjectId):
        Promise<tokensReturn> {
        const objectUserID: ObjectId = new ObjectId(userID)

        const accessToken: tokensObjectType = await jwtApp.createAccessJwt(objectUserID)

        const refreshToken: string = await jwtApp.updateRefreshJwt(objectUserID, deviceInfo, sessionID)

        const tokensObject: tokensReturn = {
            refreshToken: refreshToken,
            accessToken: accessToken,
            optionsCookie: {
                httpOnly: true,
                secure: true
            }
        }

        return tokensObject

    }

    public async confirmUserEmail(codeActivate: string) {

        const findUser: null | userBDType = await userRepository.findOneByCode(codeActivate)

        if (!findUser) {
            return null
        }

        const userIDString = findUser._id.toString()

        await userRepository.updateUser(userIDString, authParams)

    }

    public async resendingEmail(email: string) {

        const authParams: authParams = await activateCodeApp.createCode()

        await this.confirmUserEmail(authParams.codeActivated)

        await mailerApp.sendMailCode(email, authParams.codeActivated)
    }

    public async updateUserPass(authDTO: userReqPass) {
        const findUser: null | userBDType = await userRepository.findOneByCode(authDTO.recoveryCode)

        if (!findUser) {
            return null
        }

        const userIDString = findUser._id.toString()

        const hushPass: string = await bcryptApp.saltGenerate(authDTO.newPassword)

        await userRepository.updatePasswordUser(userIDString, authParams, hushPass)

    }

}

export const authService = new AuthService()