import {body} from "express-validator";

export const postsValidator = [
    body('title').isString().bail().trim().bail().notEmpty().bail().isLength({ max: 30}).bail().withMessage('Field title incorrect'),
    body('shortDescription').isString().bail().trim().bail().notEmpty().bail().isLength({ max: 100}).bail().withMessage('Field shortDescription incorrect'),
    body('content').isString().bail().trim().bail().notEmpty().bail().isLength({ max: 1000}).bail().withMessage('Field content incorrect'),
    body('blogId').isString().bail().trim().bail().notEmpty().bail().withMessage('Field blogId incorrect')
]

