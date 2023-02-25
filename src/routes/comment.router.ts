import {Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import {commentController} from "../controllers/comment.controller";

export const commentRouter = Router({})

commentRouter.get('/:id',
    indexMiddleware.USER_ID,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.getOneComment
)

commentRouter.put('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.updateComment
)

commentRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.likeStatusComment
)

commentRouter.delete('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.deleteComment
)