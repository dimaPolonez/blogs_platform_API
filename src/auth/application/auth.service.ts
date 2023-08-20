import {ObjectId} from "mongodb";
import BcryptApp from "../../adapters/bcrypt.adapter";
import {
    AuthParamsType,
    AuthReqType,
    DeviceInfoObjectType,
    TokensObjectFullType,
    UserBDType, UserReqType
} from "../../core/models";
import AuthRepository from "../repository/auth.repository";
import JwtApp from "../../adapters/jwt.adapter";
import {add} from "date-fns";
import SessionsService from "../sessions/application/sessions.service";
import ActiveCodeApp from "../../adapters/codeActive.adapter";
import MailerApp from "../../adapters/mailer.adapter";


class AuthService {
    public async authUser(
        body: AuthReqType,
        deviceInfo : DeviceInfoObjectType
    ):Promise<TokensObjectFullType | null>{
        const findNameUser: UserBDType | null = await
            AuthRepository.findOneUserLoginOrEmail(body.loginOrEmail)

        if (!findNameUser || findNameUser.authUser.confirm === false) {
            return null
        }

        const result: boolean = await
            BcryptApp.hushCompare(body.password, findNameUser.authUser.hushPass)

        if (!result) {
            return null
        }

        const accessToken: string = await
            JwtApp.createAccessJwt(findNameUser._id)

        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        const deviceId: ObjectId = await SessionsService.addNewDevice(findNameUser._id, deviceInfo, expiresTime)

        const refreshToken: string = await
            JwtApp.createRefreshJwt(deviceId, findNameUser._id, expiresBase)

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    public async confirmUserEmail(
        code: string,
        authParams: AuthParamsType,
    ){
        const findUserByCode: UserBDType | null = await
            AuthRepository.findOneUserToCode(code)

        if (!findUserByCode) {
            return null
        }

        await AuthRepository.updateConfirmUser(findUserByCode._id,findUserByCode.authUser.hushPass, authParams)
    }

    public async updateUserPass(
        authParams: AuthParamsType,
        code: string,
        newPassword: string
    ){
        const findUser: UserBDType | null = await
            AuthRepository.findOneUserToCode(code)

        if (!findUser) {
            return null
        }

        const hushPass: string = await BcryptApp.saltGenerate(newPassword)

        await AuthRepository.updateUserPass(findUser._id, authParams, hushPass)
    }

    public async createNewUser(
        body: UserReqType
    ){
        const authParams: AuthParamsType = await ActiveCodeApp.createCode()

        const hushPass: string = await BcryptApp.saltGenerate(body.password)

        await AuthRepository.createUser(body, authParams, hushPass)

        await MailerApp.sendMailCode(body.email, authParams.codeActivated)
    }

    public async resendingEmail(
        email: string
    ){
        const findUser: UserBDType | null = await AuthRepository.findOneUserLoginOrEmail(email)

        if (findUser) {
            const authParams: AuthParamsType = await ActiveCodeApp.createCode()

            await AuthRepository.updateConfirmUser(findUser._id,findUser.authUser.hushPass, authParams)

            await MailerApp.sendMailCode(email, authParams.codeActivated)
        }
    }

    public async updateRefreshToken(
        deviceInfo: DeviceInfoObjectType,
        userId: ObjectId,
        sessionId:ObjectId
    ):Promise<TokensObjectFullType>{
        const accessToken: string = await
            JwtApp.createAccessJwt(userId)

        const deviceId: ObjectId = new ObjectId(sessionId)

        const expiresBase: number = 5400

        const expiresTime: string = add(new Date(), {
            seconds: expiresBase
        }).toString()

        await SessionsService.updateExpiredSession(deviceId, deviceInfo, expiresTime)

        const refreshToken: string = await
            JwtApp.createRefreshJwt(deviceId, userId, expiresBase)

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    public async findOneUserToId(
        userId: ObjectId
    ):Promise<UserBDType | null>{
        const bodyID: ObjectId = new ObjectId (userId)

        const findUserById: UserBDType | null = await AuthRepository.findOneUser(bodyID)

        if (!findUserById) {
            return null
        }

        return findUserById
    }

    public async findOneUserToCode(
        code: string
    ):Promise<UserBDType | null>{
        const findUserByCode: UserBDType | null = await
            AuthRepository.findOneUserToCode(code)

        if (!findUserByCode) {
            return null
        }

        return findUserByCode
    }

    public async createUserNewPass(
        email: string
    ){
        const findUserByEmail: UserBDType | null = await
            AuthRepository.findOneUserLoginOrEmail(email)

        if (findUserByEmail) {

        const authParams: AuthParamsType = await ActiveCodeApp.createCode()

        await AuthRepository.updateNewPass(findUserByEmail._id, authParams)

        await MailerApp.sendMailPass(email, authParams.codeActivated)
        }
    }
}

export default new AuthService()