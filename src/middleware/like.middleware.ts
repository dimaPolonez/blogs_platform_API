import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import JwtApp from "../application/jwt.application";
import {myLikeStatus} from "../models/likes.models";
import {ObjectId} from "mongodb";


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
) => 
{
    req.userID = new ObjectId()

    if (!req.headers.authorization) {
        next()
        return
    }

    const accessToken: string = req.headers.authorization.substring(7)

    const userObjectId: ObjectId | null = await JwtApp.verifyAccessJwt(accessToken)

    if (userObjectId) {
        req.userID = new ObjectId (userObjectId)
        next()
        return
    } 
    next()
}