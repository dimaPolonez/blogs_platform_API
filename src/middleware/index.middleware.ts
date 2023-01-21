import {blogValidator} from './blog.middleware';
import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {postsOfBlogValidator, postValidator} from './post.middleware';
import {userAuthValidator, usersValidator} from "./user.middleware";
import {commentValidator} from "./comment.middleware";
import {
    authConfirm, authEmail,
    authRegistration,
    basicAuthorization,
    bearerAuthorization,
    codeValidator,
    emailValidator
} from './auth.middleware';

export const errorsValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorsMessages: errors.array().map((x) => {
                let object: object = {message: x.msg, field: x.param};
                return object;
            }),
        })
    }

    next();
    return
}

export const indexMiddleware = {
    BASIC_AUTHORIZATION: basicAuthorization,
    BEARER_AUTHORIZATION: bearerAuthorization,
    BLOGS_VALIDATOR: blogValidator,
    POSTS_VALIDATOR: postValidator,
    USERS_VALIDATOR: usersValidator,
    COMMENT_VALIDATOR: commentValidator,
    POSTS_OF_BLOG_VALIDATOR: postsOfBlogValidator,
    USER_AUTH: userAuthValidator,
    CHECK_LOGIN: authRegistration,
    CHECK_CODE: authConfirm,
    CHECK_EMAIL: authEmail,
    EMAIL_VALIDATOR: emailValidator,
    CODE_VALIDATOR: codeValidator,
    ERRORS_VALIDATOR: errorsValidator
}