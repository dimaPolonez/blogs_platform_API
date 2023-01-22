import {Request, Response, NextFunction} from "express";
import {body, header, validationResult} from "express-validator";
import {ObjectId} from "mongodb";
import jwtApplication from "../application/jwt.application";
import {ERRORS_CODE, SUPERADMIN} from "../data/db.data";
import {userBDType} from "../models/user.models";
import authService from "../services/auth.service";


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

export const authRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const checked: boolean = await authService.checkUnique(req.body);

    if (checked) {
        next();
        return
    } else {
        res.sendStatus(ERRORS_CODE.BAD_REQUEST_400)
    }
}

export const authConfirm = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const checked: userBDType | false = await authService.checkCode(req.body.code);

    if (checked) {
        req.user = checked;
        next();
        return
    } else {
        res.sendStatus(ERRORS_CODE.BAD_REQUEST_400)
    }
}

export const codeValidator = [
    body('code')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 36, max: 36})
        .bail()
        .withMessage('Field code incorrect'),
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
        .withMessage('Field email incorrect'),
];

export const authEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const checked: string | false = await authService.checkEmail(req.body.email);

    if (checked) {
        req.user.activeUser.codeActivated = checked;
        next();
        return
    } else {
        res.sendStatus(ERRORS_CODE.BAD_REQUEST_400)
    }
}