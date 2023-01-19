import {indexMiddleware} from "../middleware/index.middleware";
import {Request, Response, Router} from "express";
import userService from "../services/user.service";
import {ERRORS_CODE} from "../data/db.data";
import jwtApplication from "../application/jwt.application";
import {bodyReqType} from "../models/request.models";
import {userBDType} from "../models/user.models";
import {authMeType, authReqType, tokenObjectType} from "../models/auth.models";


const authRouter = Router({});

authRouter.post('/login',
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: bodyReqType<authReqType>, res: Response) => {
        try {
            const auth: false | userBDType = await userService.auth(req.body)

            if (auth) {
                const token: tokenObjectType = await jwtApplication.createJwt(auth);

                res.status(ERRORS_CODE.OK_200).send(token);
            } else {
                res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    });

authRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    async (req: Request, res: Response) => {
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
    });

export default authRouter;