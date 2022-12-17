import {parserMiddleware} from "./json.middlware";
import {blogsValidator} from "./blogs.middleware";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {postsValidator} from "./posts.middleware";



export const errorsValidator = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array().map(
                (x) => x.msg)});
    } else {
        next()
    }

}

export const  indexMiddleware = {
    JSON_PARSER : parserMiddleware,
    BLOGS_VALIDATOR: blogsValidator,
    POSTS_VALIDATOR: postsValidator,
    ERRORS_VALIDATOR: errorsValidator
}