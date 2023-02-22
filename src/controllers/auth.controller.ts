import { Request, Response } from 'express';
import JwtApp from "../application/jwt.application";
import MailerApp from '../application/mailer.application';
import { ERRORS_CODE } from '../data/db.data';
import { authMeType, authReqType, tokensObjectType } from "../models/auth.models";
import { bodyReqType } from "../models/request.models";
import { userBDType, userObjectResult, userReqType } from "../models/user.models";
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { authParams } from "../models/auth.models";
import ActiveCodeApp from "../application/codeActive.application";
import { deviceInfoObject } from "../models/session.models";
import GuardService from '../services/guard.service';
import BcryptApp from '../application/bcrypt.application';
import { tokensReturn } from '../models/likes.models';

class AuthController {

    public async authorization(req: bodyReqType<authReqType>, res: Response) {
        try {
            const deviceInfo: deviceInfoObject = {
                ip: req.ip,
                title: req.headers["user-agent"]!
            }

            const authValid: null | tokensReturn = await AuthService.authUser(req.body, deviceInfo)

            if (authValid) {

                res.status(ERRORS_CODE.OK_200)
                    .cookie('refreshToken', authValid.refreshToken, authValid.optionsCookie)
                    .json(authValid.accessToken)
                return
            }

            res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const deviceInfo: deviceInfoObject = {
                ip: req.ip,
                title: req.headers["user-agent"]!
            }

            const newTokens: tokensReturn = await AuthService.newTokens(req.userID, deviceInfo, req.sessionId)

            res.status(ERRORS_CODE.OK_200)
                .cookie('refreshToken', newTokens.refreshToken, newTokens.optionsCookie)
                .json(newTokens.accessToken)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createNewPass(req: Request, res: Response) {
        try {
            await UserService.updateUser(req.body)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateNewPass(req: Request, res: Response) {
        try {
            await AuthService.updateUserPass(req.body)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async confirmEmail(req: Request, res: Response) {
        try {

            await AuthService.confirmUserEmail(req.body.code)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async registration(req: bodyReqType<userReqType>, res: Response) {
        try {
            await UserService.createUserRegistration(req.body)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async resendingEmail(req: Request, res: Response) {
        try {
            await AuthService.resendingEmail(req.body.email)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async logout(req: Request, res: Response) {
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