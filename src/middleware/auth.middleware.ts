import { Request, Response, NextFunction } from "express";
import { body, header } from "express-validator";
import { ERRORS_CODE } from "../data/db.data";
import { returnRefreshObject } from "../models/session.models";
import { checkedService } from "../services/checked.service";

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

    const userID: string | null = await checkedService.validAccess(accessToken)

    if (userID) {
        req.userID = userID
        next()
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

    const objectUserID: returnRefreshObject | null = await checkedService.validRefresh(req.cookies.refreshToken)

    if (objectUserID) {
        req.userID = objectUserID.userId
        req.sessionID = objectUserID.sessionId
        next()
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
        .custom(checkedService.activateCodeValid)
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
        .custom(checkedService.emailToBase)
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
        .isLength({ min: 6, max: 20 })
        .bail()
        .withMessage('Field newPassword incorrect'),
    body('recoveryCode')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .custom(checkedService.activateCodeValid)
        .bail()
        .withMessage('Field recoveryCode incorrect')
]

