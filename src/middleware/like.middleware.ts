import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import jwtApplication from "../application/jwt.application";
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
        .custom(async (value) => {
            if (Object.values(myLikeStatus).includes(value)) {
                return true
            } else {
                throw new Error('Field likeStatus incorrect');
            }
        })
];

export const reqUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (!req.headers.authorization) {
        req.userId = null;
        next();
        return
    }

    const accessToken: string = req.headers.authorization.substring(7)

    const userObjectId: ObjectId | null = await jwtApplication.verifyAccessJwt(accessToken);

    if (userObjectId) {
        req.userId = userObjectId;
        next();
        return
    }
    req.userId = null;
    next();
}