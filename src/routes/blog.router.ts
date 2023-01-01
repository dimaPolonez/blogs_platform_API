import { Router } from 'express';
import blogController from '../controllers/blog.controller';
import { indexMiddleware } from '../middleware/index.middleware';
import {postsOfBlogValidator} from "../middleware/post.middleware";

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

blogRouter.get('/:id/posts', blogController.getAllPostsOfBlog);

blogRouter.post(
    '/:id/posts',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_OF_BLOG_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.createOnePostOfBlog
);

export default blogRouter;
