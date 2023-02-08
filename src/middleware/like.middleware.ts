import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import jwtApplication from "../application/jwt.application";
import {returnRefreshObject} from "../models/activeDevice.models";
import {myLikeStatus} from "../models/likes.models";


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

    if (!req.cookies.refreshToken) {
        req.userId = 'quest';
        next();
        return
    }

    const refreshToken: string = req.cookies.refreshToken;

    const userRefreshId: returnRefreshObject | null = await jwtApplication.verifyRefreshJwt(refreshToken);

    if (userRefreshId) {
        req.userId = userRefreshId.userId.toString();
        next();
        return
    }
    req.userId = 'quest';
    next();
    return
}