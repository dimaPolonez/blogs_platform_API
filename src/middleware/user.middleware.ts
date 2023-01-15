import {body} from "express-validator";

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
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
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
