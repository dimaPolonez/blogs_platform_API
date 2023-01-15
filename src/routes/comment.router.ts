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

commentRouter.delete('/:id',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    commentController.delete);

export default commentRouter;