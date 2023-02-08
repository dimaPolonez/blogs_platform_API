import {body} from "express-validator";

export const commentValidator = [
    body('content')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({min: 20, max: 300})
        .bail()
        .withMessage('Field content incorrect')
];
