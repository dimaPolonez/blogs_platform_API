import {indexMiddleware} from "../middleware/index.middleware";
import {Request, Response, Router} from "express";
import userService from "../services/user.service";
import {ERRORS_CODE} from "../data/db.data";
import jwtApplication from "../application/jwt.application";
import {tokenObjectType} from "../models/data.models";


const authRouter = Router({});

authRouter.post('/login',
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: Request, res: Response) => {
        try {
            const auth: any = await userService.auth(req.body)

            if (auth) {
                const token = await jwtApplication.createJwt(auth);

                res.status(ERRORS_CODE.CREATED_201).json(token);
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
/*        try {
            const auth = await userService.auth(req.body)

            if (auth) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.UNAUTHORIZED_401);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }*/
    });

export default authRouter;