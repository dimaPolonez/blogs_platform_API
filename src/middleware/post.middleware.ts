import {body} from 'express-validator';
import {url} from "inspector";
import {BLOGS} from "../data/db.data";
import {ObjectId} from "mongodb";

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
            const result = await BLOGS.find({_id: valueId}).toArray();
            if (result.length === 0) {
                throw new Error('Field blogId incorrect');
            }
            return true
        })
];

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
        .withMessage('Field content incorrect'),
];
