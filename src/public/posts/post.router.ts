import {Router} from 'express';
import PostController from './post.controller';
import {indexMiddleware} from "../../middleware";

const postRouter = Router({})

postRouter.get(
    '/:id', 
    indexMiddleware.USER_ID,
    PostController.getOnePost
)

postRouter.post(
    '/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.createPost
)

postRouter.put(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.updatePost
)

postRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.likeStatusPost
)

postRouter.delete(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.deletePost
)

postRouter.post('/:id/comments',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.createCommentOfPost
)

postRouter.get('/',
    indexMiddleware.USER_ID,
    PostController.getAllPost)

postRouter.get('/:id/comments',
    indexMiddleware.USER_ID,
    PostController.getAllCommentsOfPost)

export default postRouter
