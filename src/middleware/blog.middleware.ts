import { body } from 'express-validator';

export const blogValidator = [
  body('name')
    .isString()
    .bail()
    .trim()
    .bail()
    .notEmpty()
    .bail()
    .isLength({ max: 15 })
    .bail()
    .withMessage('Field name incorrect'),
  body('description')
    .isString()
    .bail()
    .trim()
    .bail()
    .notEmpty()
    .bail()
    .isLength({ max: 500 })
    .bail()
    .withMessage('Field description incorrect'),
  body('websiteUrl')
    .isString()
    .bail()
    .trim()
    .bail()
    .notEmpty()
    .bail()
    .isLength({ max: 100 })
    .bail()
    .isURL()
    .bail()
    .withMessage('Field websiteUrl incorrect'),
];
