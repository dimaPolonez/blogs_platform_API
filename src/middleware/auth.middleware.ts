import {Request, Response, NextFunction} from "express";
import {body, header, validationResult} from "express-validator";
import {ObjectId} from "mongodb";
import jwtApplication from "../application/jwt.application";
import {ERRORS_CODE, SUPERADMIN} from "../data/db.data";
import { returnRefreshObject } from "../models/activeDevice.models";
import {userBDType} from "../models/user.models";
import authService from "../services/auth.service";
import checkedService from "../services/checked.service";

export const basicAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    header('authorization')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .withMessage('Field authorization incorrect');

    if (
        req.headers.authorization !== `Basic ${SUPERADMIN[0].logPass}` ||
        !errors.isEmpty()
    ) {
        res.status(401).json('Unauthorized');
    } else {
        next();
    }
};

export const bearerAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (!req.headers.authorization) {
        res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
        return
    }

    const token: string = req.headers.authorization.substring(7)

    const userAccessId: ObjectId | null = await jwtApplication.verifyAccessJwt(token);

    if (userAccessId) {
        const getId: ObjectId = new ObjectId(userAccessId)
        const findUser: false | userBDType = await authService.getOne(getId);
        if (findUser) {
            req.user = findUser;
            next();
            return
        }
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        return
    }
    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
}

export const cookieRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (!req.cookies.refreshToken) {
        res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
        return
    }

    const refreshToken: string = req.cookies.refreshToken;

    const userRefreshId: returnRefreshObject | null = await jwtApplication.verifyRefreshJwt(refreshToken);

    if (userRefreshId) {
        const getId: ObjectId = new ObjectId(userRefreshId.userId)
        const findUser: false | userBDType = await authService.getOne(getId);
        if (findUser) {
            req.user = findUser;
            req.sessionId = userRefreshId.sessionId;
            next();
            return
        }
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        return
    }
    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized');
}

export const codeValidator = [
    body('code')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .custom(checkedService.activateCodeValid)
        .bail()
        .withMessage('Field code incorrect')
];

export const emailValidator = [
    body('email')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .bail()
        .custom(checkedService.emailToBase)
        .bail()
        .withMessage('Field email incorrect'),
];

