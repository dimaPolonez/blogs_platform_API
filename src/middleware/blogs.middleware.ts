import {body} from "express-validator";


export const blogsValidator = [
    body('name').isString().trim().notEmpty().isLength({ max: 15}).withMessage('Field name incorrect'),
    body('description').isString().trim().notEmpty().isLength({ max: 500}).withMessage('Field description incorrect'),
    body('websiteUrl').isString().trim().notEmpty().isLength({ max: 100}).isURL().withMessage('Field websiteUrl incorrect')
]