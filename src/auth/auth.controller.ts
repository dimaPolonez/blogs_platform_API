import {Request, Response} from 'express';
import JwtApp from "../adapters/jwt.adapter";
import MailerApp from '../adapters/mailer.adapter';
import {ERRORS_CODE} from '../core/db.data';
import AuthService from './application/auth.service';
import UserService from '../public/users/application/user.service';
import ActiveCodeApp from "../adapters/codeActive.adapter";
import GuardService from './sessions/application/sessions.service';
import BcryptApp from '../adapters/bcrypt.adapter';
import {
    AuthMeType,
    AuthParamsType,
    AuthReqType,
    BodyReqType,
    DeviceInfoObjectType,
    TokensObjectType,
    UserBDType, UserObjectResultType, UserReqType
} from "../core/models";

const optionsCookie: object = {
    httpOnly: true,
    secure: true
}

const authParams: AuthParamsType = {
    confirm: true,
    codeActivated: 'Activated',
    lifeTimeCode: 'Activated'
}

class AuthController {

    public async authorization(
        req: BodyReqType<AuthReqType>,
        res: Response
    ){
        try {
            const authValid: null | UserBDType = await AuthService.authUser(req.body)

            if (authValid) {
                const deviceInfo: DeviceInfoObjectType = {
                    ip: req.ip,
                    title: req.headers["user-agent"]!
                }

                const accessToken: TokensObjectType = await JwtApp.createAccessJwt(authValid)

                const refreshToken: string = await JwtApp.createRefreshJwt(authValid, deviceInfo)

                res.status(ERRORS_CODE.OK_200)
                    .cookie('refreshToken', refreshToken, optionsCookie)
                    .json(accessToken)
                return
            }

            res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async refreshToken(
        req: Request,
        res: Response
    ){
        try {
            const deviceInfo: DeviceInfoObjectType = {
                ip: req.ip,
                title: req.headers["user-agent"]!
            }

            const accessToken: TokensObjectType = await JwtApp.createAccessJwt(req.user)

            const refreshToken: string = await JwtApp.updateRefreshJwt(req.user, deviceInfo, req.sessionId)

            res.status(ERRORS_CODE.OK_200)
                .cookie('refreshToken', refreshToken, optionsCookie)
                .json(accessToken)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createNewPass(
        req: Request,
        res: Response
    ){
        try {
            const findUser: null | UserBDType = await AuthService.findOneUserToEmail(req.body.email)

            if (findUser) {

                const authParams: AuthParamsType = await ActiveCodeApp.createCode()

                await UserService.updateUser(findUser, authParams)

                await MailerApp.sendMailPass(req.body.email, authParams.codeActivated)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateNewPass(
        req: Request,
        res: Response
    ){
        try {
            const findUser: null | UserBDType = await AuthService.findOneUserToCode(req.body.recoveryCode)

            if (findUser) {
                const hushPass: string = await BcryptApp.saltGenerate(req.body.newPassword)

                await AuthService.updateUserPass(findUser._id, authParams, hushPass)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
            
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async confirmEmail(
        req: Request,
        res: Response
    ){
        try {
            const findUser: null | UserBDType = await AuthService.findOneUserToCode(req.body.code)

            if (findUser) {
                await AuthService.confirmUserEmail(findUser, authParams)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async registration(
        req: BodyReqType<UserReqType>,
        res: Response
    ){
        try {
            const authParams: AuthParamsType = await ActiveCodeApp.createCode()

            const createdUser: UserObjectResultType = await UserService.createUser(req.body, authParams)

            await MailerApp.sendMailCode(createdUser.email, authParams.codeActivated)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async resendingEmail(
        req: Request,
        res: Response
    ){
        try {
            const findUser: null | UserBDType = await AuthService.findOneUserToEmail(req.body.email)

            if (findUser) {
                const authParams: AuthParamsType = await ActiveCodeApp.createCode()

                await AuthService.confirmUserEmail(findUser, authParams)

                await MailerApp.sendMailCode(req.body.email, authParams.codeActivated)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async logout(
        req: Request,
        res: Response
    ){
        try {
            await GuardService.killOneSessionLogout(req.sessionId)

            res
                .clearCookie('refreshToken')
                .sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    async aboutMe(
        req: Request,
        res: Response
    ){
        try {
            const aboutMe: AuthMeType = {
                userId: req.user._id,
                email: req.user.infUser.email,
                login: req.user.infUser.login
            }

            res.status(ERRORS_CODE.OK_200).json(aboutMe)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

}


export default new AuthController()