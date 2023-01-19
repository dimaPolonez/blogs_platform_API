import {Request, Response} from 'express';
import jwtApplication from "../application/jwt.application";
import { ERRORS_CODE } from '../data/db.data';
import { authMeType, authReqType, tokenObjectType } from "../models/auth.models";
import { bodyReqType } from "../models/request.models";
import { userBDType, userObjectResult, userReqType } from "../models/user.models";
import authService from '../services/auth.service';
import userService from '../services/user.service';

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
            await authService.confirm(req.user);
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async registration(req: bodyReqType<userReqType>, res: Response) {
        try {
            const confirm: boolean = false;

            const user: userObjectResult = await userService.create(req.body, confirm);

            if (user) {
                const findUser: false | userBDType  = await authService.getOne(user.id);
                
                if (findUser) {
                    await authService.sendMail(findUser);
                    res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
                }
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async resendingEmail(req: Request, res: Response) {
        try {
            await authService.sendMail(req.user);
            res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async aboutMe(req: Request, res: Response) {
        try {
            const me: authMeType = {
                email: req.user.email,
                login: req.user.login,
                userId: req.user._id
            }
            res.status(ERRORS_CODE.OK_200).json(me);
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

}


export default new authController();