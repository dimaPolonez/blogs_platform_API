import {Request, Response} from 'express';
import JwtApp from "../application/jwt.application";
import MailerApp from '../application/mailer.application';
import {ERRORS_CODE} from '../data/db.data';
import {authMeType, authReqType, tokensObjectType} from "../models/auth.models";
import {bodyReqType} from "../models/request.models";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import {authParams} from "../models/auth.models";
import ActiveCodeApp from "../application/codeActive.application";
import {deviceInfoObject} from "../models/session.models";
import GuardService from '../services/guard.service';
import BcryptApp from '../application/bcrypt.application';

const optionsCookie: object = {
    httpOnly: true,
    secure: true
}

const authParams: authParams = {
    confirm: true,
    codeActivated: 'Activated',
    lifeTimeCode: 'Activated'
}

class AuthController {

    public async authorization(req: bodyReqType<authReqType>, res: Response) 
    {
        try {
            const authValid: null | userBDType = await AuthService.authUser(req.body)

            if (authValid) {
                const deviceInfo: deviceInfoObject = {
                    ip: req.ip,
                    title: req.headers["user-agent"]!
                }

                const accessToken: tokensObjectType = await JwtApp.createAccessJwt(authValid)

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

    public async refreshToken(req: Request, res: Response) 
    {
        try {
            const deviceInfo: deviceInfoObject = {
                ip: req.ip,
                title: req.headers["user-agent"]!
            }

            const accessToken: tokensObjectType = await JwtApp.createAccessJwt(req.user)

            const refreshToken: string = await JwtApp.updateRefreshJwt(req.user, deviceInfo, req.sessionId)

            res.status(ERRORS_CODE.OK_200)
                .cookie('refreshToken', refreshToken, optionsCookie)
                .json(accessToken)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createNewPass(req: Request, res: Response) 
    {
        try {
            const findUser: null | userBDType = await AuthService.findOneUserToEmail(req.body.email)

            if (findUser) {

                const authParams: authParams = await ActiveCodeApp.createCode()

                await UserService.updateUser(findUser, authParams)

                await MailerApp.sendMailPass(req.body.email, authParams.codeActivated)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateNewPass(req: Request, res: Response) 
    {
        try {
            const findUser: null | userBDType = await AuthService.findOneUserToCode(req.body.recoveryCode)

            if (findUser) {
                const hushPass: string = await BcryptApp.saltGenerate(req.body.newPassword)

                await AuthService.updateUserPass(findUser._id, authParams, hushPass)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
            
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async confirmEmail(req: Request, res: Response) 
    {
        try {
            const findUser: null | userBDType = await AuthService.findOneUserToCode(req.body.code)

            if (findUser) {
                await AuthService.confirmUserEmail(findUser, authParams)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async registration(req: bodyReqType<userReqType>, res: Response) 
    {
        try {
            const authParams: authParams = await ActiveCodeApp.createCode()

            const createdUser: userObjectResult = await UserService.createUser(req.body, authParams)

            await MailerApp.sendMailCode(createdUser.email, authParams.codeActivated)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async resendingEmail(req: Request, res: Response) 
    {
        try {
            const findUser: null | userBDType = await AuthService.findOneUserToEmail(req.body.email)

            if (findUser) {
                const authParams: authParams = await ActiveCodeApp.createCode()

                await AuthService.confirmUserEmail(findUser, authParams)

                await MailerApp.sendMailCode(req.body.email, authParams.codeActivated)
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async logout(req: Request, res: Response) 
    {
        try {
            await GuardService.killOneSessionLogout(req.sessionId)

            res
                .clearCookie('refreshToken')
                .sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    async aboutMe(req: Request, res: Response) {
        try {
            const aboutMe: authMeType = {
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