import {body} from 'express-validator';
import BlogRepository from '../data/repository/blog.repository';
import { blogObjectResult } from '../models/blog.models';

export const postValidator = [
    body('title')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 30})
        .bail()
        .withMessage('Field title incorrect'),
    body('shortDescription')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 100})
        .bail()
        .withMessage('Field shortDescription incorrect'),
    body('content')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 1000})
        .bail()
        .withMessage('Field content incorrect'),
    body('blogId')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .withMessage('Field blogId incorrect')
        .custom(async (value) => {

            const findBlog: blogObjectResult | null = await BlogRepository.findOneById(value)

            if (!findBlog) {
                throw new Error('Field blogId incorrect')
            }

            return true 
        })
]

export const postsOfBlogValidator = [
    body('title')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 30})
        .bail()
        .withMessage('Field title incorrect'),
    body('shortDescription')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 100})
        .bail()
        .withMessage('Field shortDescription incorrect'),
    body('content')
        .isString()
        .bail()
        .trim()
        .bail()
        .notEmpty()
        .bail()
        .isLength({max: 1000})
        .bail()
        .withMessage('Field content incorrect')
]
