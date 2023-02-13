import {Request, Response} from 'express';
import jwtApplication from "../application/jwt.application";
import mailerApplication from '../application/mailer.application';
import {ERRORS_CODE} from '../data/db.data';
import {authMeType, authReqType, tokensObjectType} from "../models/auth.models";
import {bodyReqType} from "../models/request.models";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import authService from '../services/auth.service';
import userService from '../services/user.service';
import {authParams} from "../models/auth.models";
import codeActiveApplication from "../application/codeActive.application";
import {deviceInfoObject} from "../models/activeDevice.models";
import guardService from '../services/guard.service';
import {ObjectId} from 'mongodb';
import checkedService from '../services/checked.service';
import bcryptApplication from '../application/bcrypt.application';
import {convertCompilerOptionsFromJson} from 'typescript';

const optionsCookie: object = {
    httpOnly: true,
    secure: true
}

class authController {

    async authorization(req: bodyReqType<authReqType>, res: Response) {
        try {
            const auth: null | userBDType = await authService.authUser(req.body)

            if (auth) {

                const deviceInfo: deviceInfoObject = {
                    ip: req.ip,
                    title: req.headers["user-agent"]!
                }

                const accessToken: tokensObjectType = await jwtApplication.createAccessJwt(auth)

                const refreshToken: string = await jwtApplication.createRefreshJwt(auth, deviceInfo)

                res.status(ERRORS_CODE.OK_200)
                    .cookie('refreshToken', refreshToken, optionsCookie)
                    .json(accessToken);
            } else {
                res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {

            const deviceInfo: deviceInfoObject = {
                ip: req.ip,
                title: req.headers["user-agent"]!
            }

            const accessToken: tokensObjectType = await jwtApplication.createAccessJwt(req.user)

            const refreshToken: string = await jwtApplication.updateRefreshJwt(req.user, deviceInfo, req.sessionId)

            res.status(ERRORS_CODE.OK_200)
                .cookie('refreshToken', refreshToken, optionsCookie)
                .json(accessToken);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async createNewPass(req: Request, res: Response) {
        try {

            const findUser: null | userBDType = await authService.findOneUserToEmail(req.body.email)

            if (findUser) {
                const authParams: authParams = await codeActiveApplication.createCode();
                await userService.update(findUser, authParams)
                await mailerApplication.sendMailPass(req.body.email, authParams.codeActivated);
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
                return
            }

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async updateNewPass(req: Request, res: Response) {
        try {
            const authParams: authParams = {
                confirm: true,
                codeActivated: 'Activated',
                lifeTimeCode: 'Activated'
            }

            const userObject: null | userBDType = await authService.findOneUserToCode(req.body.recoveryCode);

            const hushPass: string = await bcryptApplication.saltGenerate(req.body.newPassword)

            await authService.updateUserPass(userObject._id, authParams, hushPass);

            await mailerApplication.sendMailActivate(userObject.infUser.email);

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async confirmEmail(req: Request, res: Response) {
        try {

            const authParams: authParams = {
                confirm: true,
                codeActivated: 'Activated',
                lifeTimeCode: 'Activated'
            }

            const userObject: null | userBDType = await authService.findOneUserToCode(req.body.code);

            await authService.confirmUserEmail(userObject, authParams);

            await mailerApplication.sendMailActivate(userObject.infUser.email);

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async registration(req: bodyReqType<userReqType>, res: Response) {
        try {
            const authParams: authParams = await codeActiveApplication.createCode();

            const user: userObjectResult = await userService.create(req.body, authParams);

            await mailerApplication.sendMailCode(user.email, authParams.codeActivated);
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async resendingEmail(req: Request, res: Response) {
        try {
            const userObject: null | userBDType = await authService.findOneUserToEmail(req.body.email);
            const authParams: authParams = await codeActiveApplication.createCode();

            await authService.confirmUserEmail(userObject, authParams);
            await mailerApplication.sendMailCode(req.body.email, authParams.codeActivated);
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async logout(req: Request, res: Response) {
        try {

            const sessionId: ObjectId = new ObjectId(req.sessionId);

            await guardService.killOneSessionLogout(sessionId)

            res.clearCookie('refreshToken')
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async aboutMe(req: Request, res: Response) {
        try {
            const me: authMeType = {
                userId: req.user._id,
                email: req.user.infUser.email,
                login: req.user.infUser.login
            }
            res.status(ERRORS_CODE.OK_200).json(me);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

}


export default new authController();