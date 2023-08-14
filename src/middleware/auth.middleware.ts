import {Request, Response, NextFunction} from "express";
import {body, header} from "express-validator";
import {ObjectId} from "mongodb";
import JwtApp from "../adapters/jwt.adapter";
import {ERRORS_CODE} from "../core/db.data";
import AuthService from "../auth/application/auth.service";
import CheckedService from "../helpers/checked.service";
import {ReturnRefreshObjectType, UserBDType} from "../core/models";

export const basicAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    header('authorization')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .withMessage('Field authorization incorrect')

    if (req.headers.authorization === `Basic YWRtaW46cXdlcnR5`) {
        next()
        return 
    } 

    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized')
}

export const bearerAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized')
        return
    }

    const accessToken: string = req.headers.authorization.substring(7)

    const userAccessId: ObjectId | null = await JwtApp.verifyAccessJwt(accessToken)

    if (userAccessId) {

        const userAccessIdObject = new ObjectId(userAccessId)

        const findUser: null | UserBDType = await AuthService.findOneUserToId(userAccessIdObject)

        if (findUser) {
            req.user = findUser
            next()
            return
        }

        res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        return
    }

    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized')
}

export const cookieRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.cookies.refreshToken) {
        res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized')
        return
    }

    const refreshToken: string = req.cookies.refreshToken

    const userRefreshId: ReturnRefreshObjectType | null = await JwtApp.verifyRefreshJwt(refreshToken)

    if (userRefreshId) {

        const findUser: null | UserBDType = await AuthService.findOneUserToId(userRefreshId.userId)

        if (findUser) {
            req.user = findUser
            req.sessionId = userRefreshId.sessionId
            next()
            return
        }

        res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        return
    }

    res.status(ERRORS_CODE.UNAUTHORIZED_401).json('Unauthorized')
}

export const codeValidator = [
    body('code')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .custom(CheckedService.activateCodeValid)
        .bail()
        .withMessage('Field code incorrect')
]

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
        .custom(CheckedService.emailToBase)
        .bail()
        .withMessage('Field email incorrect')
]

export const passEmailValidator = [
    body('email')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Field email incorrect')
]

export const newPassValidator = [
    body('newPassword')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 6, max: 20})
        .bail()
        .withMessage('Field newPassword incorrect'),
    body('recoveryCode')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .custom(CheckedService.activateCodeValid)
        .bail()
        .withMessage('Field recoveryCode incorrect')
]

