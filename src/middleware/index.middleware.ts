import {blogValidator} from './blog.middleware';
import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {postsOfBlogValidator, postValidator} from './post.middleware';
import {userAuthValidator, usersValidator} from "./user.middleware";
import {commentValidator} from "./comment.middleware";
import {
    basicAuthorization,
    bearerAuthorization,
    codeValidator, cookieRefresh,
    emailValidator,
    newPassValidator,
    passEmailValidator
} from './auth.middleware';
import {ipBanner} from './ip.middleware';
import {likeValidator, reqUserId} from './like.middleware';

export const errorsValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorsMessages: errors.array().map((x) => {

                return {message: x.msg, field: x.param}
                 
            })
        })
    }
    next()
}

export const indexMiddleware = {
    BASIC_AUTHORIZATION: basicAuthorization,
    BEARER_AUTHORIZATION: bearerAuthorization,
    COOKIE_REFRESH: cookieRefresh,
    USER_ID: reqUserId,
    IP_BANNER: ipBanner,
    BLOGS_VALIDATOR: blogValidator,
    POSTS_VALIDATOR: postValidator,
    USERS_VALIDATOR: usersValidator,
    COMMENT_VALIDATOR: commentValidator,
    LIKE_VALIDATOR: likeValidator,
    POSTS_OF_BLOG_VALIDATOR: postsOfBlogValidator,
    USER_AUTH: userAuthValidator,
    EMAIL_VALIDATOR: emailValidator,
    CODE_VALIDATOR: codeValidator,
    PASS_EMAIL_VALIDATOR: passEmailValidator,
    NEW_PASS_VALIDATOR: newPassValidator,
    ERRORS_VALIDATOR: errorsValidator
}