import {Request, Response} from 'express';
import jwtApplication from "../application/jwt.application";
import mailerApplication from '../application/mailer.application';
import {ERRORS_CODE} from '../data/db.data';
import {authMeType, authReqType, tokenObjectType} from "../models/auth.models";
import {bodyReqType} from "../models/request.models";
import {userBDType, userObjectResult, userReqType} from "../models/user.models";
import authService from '../services/auth.service';
import userService from '../services/user.service';
import {authParams} from "../models/auth.models";
import codeActiveApplication from "../application/codeActive.application";

class authController {

    async authorization(req: bodyReqType<authReqType>, res: Response) {
        try {
            const auth: false | userBDType = await authService.auth(req.body)

            if (auth) {
                const token: tokenObjectType = await jwtApplication.createJwt(auth);
                res.status(ERRORS_CODE.OK_200).send(token);
            } else {
                res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401);
            }
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

            const userObject: userBDType = await authService.getOneToCode(req.body.code);

            await authService.confirm(userObject,authParams);

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
            const userObject: userBDType = await authService.getOneToEmail(req.body.email);
            const authParams: authParams = await codeActiveApplication.createCode();

            await authService.confirm(userObject,authParams);
            await mailerApplication.sendMailCode(req.body.email,authParams.codeActivated);
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async aboutMe(req: Request, res: Response) {
        try {
            const me: authMeType = {
                email: req.user.infUser.email,
                login: req.user.infUser.login,
                userId: req.user._id
            }
            res.status(ERRORS_CODE.OK_200).json(me);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

}


export default new authController();