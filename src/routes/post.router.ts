import { Router } from 'express';
import postController from '../controllers/post.controller';
import { indexMiddleware } from '../middleware/index.middleware';

const postRouter = Router({});

postRouter.get('/', postController.getAll);

postRouter.get('/:id', postController.getOne);

postRouter.post(
  '/',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.BLOGS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  postController.create
);

postRouter.put(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.BLOGS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  postController.update
);

postRouter.delete(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  postController.delete
);

export default postRouter;
