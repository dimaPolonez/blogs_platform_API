import {body} from "express-validator";
import checkedService from "../services/checked.service";

export const usersValidator = [
    body('login')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 3, max: 10})
        .bail()
        .matches(/^[a-zA-Z0-9_-]*$/)
        .bail()
        .custom(checkedService.loginUniq)
        .bail()
        .withMessage('Field login incorrect'),
    body('password')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 6, max: 20})
        .bail()
        .withMessage('Field password incorrect'),
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
        .custom(checkedService.emailUniq)
        .bail()
        .withMessage('Field email incorrect'),
];


export const userAuthValidator = [
    body('loginOrEmail')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .custom(checkedService.loginUniq)
        .bail()
        .custom(checkedService.emailUniq)
        .bail()
        .withMessage('Field loginOrEmail incorrect'),
    body('password')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 6, max: 20})
        .bail()
        .withMessage('Field password incorrect'),
];
