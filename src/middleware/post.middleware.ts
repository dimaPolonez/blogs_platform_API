import {body} from 'express-validator';
import {ObjectId} from "mongodb";
import { blogBDType } from '../models/blog.models';
import BlogService from '../services/blog.service';

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

            const valueId = new ObjectId(value)

        /*    const findBlog: null| blogBDType = await BlogService.findBlogById(valueId)

            if (findBlog) {
                return true
            }*/

            throw new Error('Field blogId incorrect')
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
