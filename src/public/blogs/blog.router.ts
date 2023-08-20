import {Router} from 'express';
import BlogController from './blog.controller';
import {indexMiddleware} from "../../middleware";

const blogRouter = Router({})

blogRouter.get(
    '/:id', BlogController.getOneBlog
)

blogRouter.post(
    '/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.BLOGS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    BlogController.createBlog
)

blogRouter.put(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.BLOGS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    BlogController.updateBlog
)

blogRouter.delete(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    BlogController.deleteBlog
)

blogRouter.post(
    '/:id/posts',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_OF_BLOG_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    BlogController.createOnePostOfBlog
)

blogRouter.get(
    '/',
    BlogController.getAllBlog
)

blogRouter.get(
    '/:id/posts',
    indexMiddleware.USER_ID,
    BlogController.getAllPostsOfBlog)



export default blogRouter
