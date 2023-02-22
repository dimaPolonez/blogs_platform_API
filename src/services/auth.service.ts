import {ObjectId} from "mongodb";
import BcryptApp from "../application/bcrypt.application";
import JwtApp from "../application/jwt.application";
import MailerApp from "../application/mailer.application"
import ActiveCodeApp from "../application/codeActive.application"
import UserRepository from "../data/repository/user.repository";
import {authParams, authReqType, tokensObjectType} from "../models/auth.models";
import { tokensReturn } from "../models/likes.models";
import { deviceInfoObject } from "../models/session.models";
import {userBDType, userReqPass} from "../models/user.models";

const authParams: authParams = {
    confirm: true,
    codeActivated: 'Activated',
    lifeTimeCode: 'Activated'
}

class AuthService {

    public async authUser(authDTO: authReqType, deviceInfo: deviceInfoObject):
        Promise<null | tokensReturn> 
    {
        const findUser: null | userBDType = await UserRepository.findOneByLoginOrEmail(authDTO.loginOrEmail)

        if (!findUser || !findUser.authUser.confirm) {
            return null
        }

        const validPassword: boolean = await BcryptApp.hushCompare(authDTO.password, findUser.authUser.hushPass)

        if (!validPassword) {
            return null
        }

        const refreshToken: string = await JwtApp.createRefreshJwt(findUser._id, deviceInfo)

        const accessToken: tokensObjectType = await JwtApp.createAccessJwt(findUser._id)

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
        Promise<tokensReturn> 
    {            
        const objectUserID: ObjectId = new ObjectId(userID)

        const accessToken: tokensObjectType = await JwtApp.createAccessJwt(objectUserID)

        const refreshToken: string = await JwtApp.updateRefreshJwt(objectUserID, deviceInfo, sessionID)

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

    public async confirmUserEmail(codeActivate: string)
    {

        const findUser: null | userBDType = await UserRepository.findOneByCode(codeActivate)

        if (!findUser) {
            return null
        }

        const userIDString = findUser._id.toString()

        await UserRepository.updateUser(userIDString, authParams)

    }

    public async resendingEmail(email: string){

        const authParams: authParams = await ActiveCodeApp.createCode()

        await this.confirmUserEmail(authParams.codeActivated)

        await MailerApp.sendMailCode(email, authParams.codeActivated)
    }

    public async updateUserPass(authDTO: userReqPass) 
    {
        const findUser: null | userBDType = await UserRepository.findOneByCode(authDTO.recoveryCode)

        if (!findUser) {
            return null
        }

        const userIDString = findUser._id.toString()

        const hushPass: string = await BcryptApp.saltGenerate(authDTO.newPassword)

        await UserRepository.updatePasswordUser(userIDString, authParams, hushPass)

    }

}

export default new AuthService()