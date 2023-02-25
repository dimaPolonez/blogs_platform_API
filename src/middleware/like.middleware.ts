import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import {myLikeStatus} from "../models/likes.models";
import {ObjectId} from "mongodb";
import {jwtApp} from "../application/jwt.application";


export const likeValidator = [
    body('likeStatus')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .withMessage('Field likeStatus incorrect')
        .custom((value) => {
            if (Object.values(myLikeStatus).includes(value)) {
                return true
            }
            throw new Error('Field likeStatus incorrect')
        })
]

export const reqUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        next()
        return
    }

    const accessToken: string = req.headers.authorization.substring(7)

    const userObjectId: ObjectId | null = await jwtApp.verifyAccessJwt(accessToken)

    if (userObjectId) {
        req.userID = userObjectId.toString()
        next()
        return
    }
    next()
}