import {Request, Response, NextFunction} from "express";
import {body, header, validationResult} from "express-validator";
import {ObjectId} from "mongodb";
import jwtApplication from "../application/jwt.application";
import {ERRORS_CODE, SUPERADMIN, USERS} from "../data/db.data";
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

    const token: string = req.headers.authorization!.substring(7)

    const result: string = await jwtApplication.verifyJwt(token);

    if (result) {
        const getId: ObjectId = new ObjectId(result)
        const findUser: false | userBDType = await authService.getOne(getId);
        if (findUser) {
            req.user = findUser;
            next();
            return
        }
        res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
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
        .isEmail()
        .bail()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .bail()
        .custom(checkedService.emailToBase)
        .bail()
        .withMessage('Field email incorrect'),
];
