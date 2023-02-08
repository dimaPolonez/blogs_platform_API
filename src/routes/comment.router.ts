import {Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import commentController from "../controllers/comment.controller";

const commentRouter = Router({});

commentRouter.get('/:id',
    commentController.getOne)

commentRouter.put('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.update);

commentRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    commentController.likeStatus);

commentRouter.delete('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    commentController.delete);

export default commentRouter;