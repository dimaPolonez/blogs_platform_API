import { Router } from 'express';
import blogController from '../controllers/blog.controller';
import { indexMiddleware } from '../middleware/index.middleware';

const blogRouter = Router({});

blogRouter.get('/', blogController.getAll);

blogRouter.get('/:id', blogController.getOne);

blogRouter.post(
  '/',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.BLOGS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  blogController.create
);

blogRouter.put(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.BLOGS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  blogController.update
);

blogRouter.delete(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  blogController.delete
);

export default blogRouter;
