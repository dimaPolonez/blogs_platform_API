import {Router} from "express";
import CommentController from "./comment.controller";
import {indexMiddleware} from "../../middleware";

const commentRouter = Router({})

commentRouter.get('/:id',
    indexMiddleware.USER_ID,
    CommentController.getOneComment
)

commentRouter.put('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.updateComment
)

commentRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.likeStatusComment
)

commentRouter.delete('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    CommentController.deleteComment
)

export default commentRouter