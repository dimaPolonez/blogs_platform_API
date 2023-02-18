import {Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import CommentController from "../controllers/comment.controller";

const commentRouter = Router({})

commentRouter.get('/:id',
    indexMiddleware.USER_ID,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.getOneComment
)

commentRouter.put('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.updateComment
)

commentRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.likeStatusComment
)

commentRouter.delete('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    CommentController.deleteComment
)

export default commentRouter