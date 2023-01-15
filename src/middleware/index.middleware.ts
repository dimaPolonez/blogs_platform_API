import { blogValidator } from './blog.middleware';
import { NextFunction, Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import {postsOfBlogValidator, postValidator} from './post.middleware';
import { USERS } from '../data/users.data';
import {userAuthValidator, usersValidator} from "./user.middleware";
import {commentValidator} from "./comment.middleware";

export const basicAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  header('authorization')
    .isString()
    .bail()
    .trim()
    .bail()
    .notEmpty()
    .bail()
    .withMessage('Field authorization incorrect');

  if (
    req.headers.authorization !== `Basic ${USERS[0].logPass}` ||
    !errors.isEmpty()
  ) {
    res.status(401).json('Unauthorized');
  } else {
    next();
  }
};

export const bearerAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {


}

export const errorsValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorsMessages: errors.array().map((x) => {
        let object: object = { message: x.msg, field: x.param };
        return object;
      }),
    });
  } else {
    next();
  }
};

export const indexMiddleware = {
  BASIC_AUTHORIZATION: basicAuthorization,
  BEARER_AUTHORIZATION: bearerAuthorization,
  BLOGS_VALIDATOR: blogValidator,
  POSTS_VALIDATOR: postValidator,
  USERS_VALIDATOR: usersValidator,
  COMMENT_VALIDATOR: commentValidator,
  POSTS_OF_BLOG_VALIDATOR: postsOfBlogValidator,
  USER_AUTH: userAuthValidator,
  ERRORS_VALIDATOR: errorsValidator
};
