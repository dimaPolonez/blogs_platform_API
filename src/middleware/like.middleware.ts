import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import JwtApp from "../adapters/jwt.adapter";
import {ObjectId} from "mongodb";
import {MyLikeStatus} from "../core/models";


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
            if (Object.values(MyLikeStatus).includes(value)) {
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
    req.userId = null

    if (!req.headers.authorization) {
        next()
        return
    }

    const accessToken: string = req.headers.authorization.substring(7)

    const userObjectId: ObjectId | null = await JwtApp.verifyAccessJwt(accessToken)

    if (userObjectId) {
        req.userId = new ObjectId (userObjectId)
        next()
        return
    }
    next()
}