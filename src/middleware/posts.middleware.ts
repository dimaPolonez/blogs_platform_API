import {body} from "express-validator";

export const postsValidator = [
    body('title').isString().trim().notEmpty().isLength({ max: 30}).withMessage('Field title incorrect'),
    body('shortDescription').isString().trim().notEmpty().isLength({ max: 100}).withMessage('Field shortDescription incorrect'),
    body('content').isString().trim().notEmpty().isLength({ max: 1000}).isURL().withMessage('Field content incorrect'),
    body('blogId').isString().trim().notEmpty().withMessage('Field blogId incorrect')
]

