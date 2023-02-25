import {Request, Response, NextFunction} from "express";
import {body, header} from "express-validator";
import {ObjectId} from "mongodb";
import {ERRORS_CODE} from "../data/db.data";
import {returnRefreshObject} from "../models/session.models";
import {userObjectResult} from "../models/user.models";
import {jwtApp} from "../application/jwt.application";
import {userRepository} from "../data/repository/user.repository";
import {checkedService} from "../services/checked.service";

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

    const userAccessId: ObjectId | null = await jwtApp.verifyAccessJwt(accessToken)

    if (userAccessId) {

        const userIDString = userAccessId.toString()

        const findUser: null | userObjectResult = await userRepository.findOneById(userIDString)

        if (findUser) {
            req.userID = userIDString
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

    const userRefreshId: returnRefreshObject | null = await jwtApp.verifyRefreshJwt(refreshToken)

    if (userRefreshId) {

        const userIDString = userRefreshId.userId.toString()

        const findUser: null | userObjectResult = await userRepository.findOneById(userIDString)

        if (findUser) {
            req.userID = userIDString
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
        .custom(checkedService.activateCodeValid)
        .bail()
        .withMessage('Field recoveryCode incorrect')
]

