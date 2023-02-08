import { body } from "express-validator";
import { myLikeStatus } from "../models/likes.models";


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
