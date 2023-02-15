import {Response, Router} from 'express';
import BlogController from '../controllers/blog.controller';
import {indexMiddleware} from '../middleware/index.middleware';
import QueryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import {
    notStringQueryReqPag, notStringQueryReqPagOfSearchName,
    paramsAndQueryReqType, paramsId, queryReqPag, queryReqPagOfSearchName,
    queryReqType
} from '../models/request.models';
import {resultBlogObjectType} from '../models/blog.models';
import {resultPostObjectType} from '../models/post.models';

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

blogRouter.get('/:id/posts',
    indexMiddleware.USER_ID,
    async (req: paramsAndQueryReqType<paramsId, queryReqPag>, res: Response) => 
    {
        try {
            let queryAll: notStringQueryReqPag = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allPosts: null | resultPostObjectType = await QueryService.getAllPostsOfBlog(req.params.id, queryAll, req.userId)

            if (allPosts) {
                res.status(ERRORS_CODE.OK_200).json(allPosts)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })

blogRouter.get('/', 
    async (req: queryReqType<queryReqPagOfSearchName>, res: Response) => 
    {
        try {
            let queryAll: notStringQueryReqPagOfSearchName = {
                searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allBlogs: resultBlogObjectType = await QueryService.getAllBlogs(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allBlogs)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })

export default blogRouter
