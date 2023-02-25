import {Response, Router} from 'express';
import {indexMiddleware} from '../middleware/index.middleware';
import {ERRORS_CODE} from "../data/db.data";
import {
    notStringQueryReqPag, notStringQueryReqPagOfSearchName,
    paramsAndQueryReqType, paramsId, queryReqPag, queryReqPagOfSearchName,
    queryReqType
} from '../models/request.models';
import {resultBlogObjectType} from '../models/blog.models';
import {resultPostObjectType} from '../models/post.models';
import {blogController} from "../controllers/blog.controller";
import {queryRepository} from "../data/repository/query.repository";

export const blogRouter = Router({})

blogRouter.get(
    '/:id',
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.getOneBlog
)

blogRouter.post(
    '/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.BLOGS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.createBlog
)

blogRouter.put(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.BLOGS_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.updateBlog
)

blogRouter.delete(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.deleteBlog
)

blogRouter.post(
    '/:id/posts',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_OF_BLOG_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.createOnePostOfBlog
)

blogRouter.get('/:id/posts',
    indexMiddleware.USER_ID,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: paramsAndQueryReqType<paramsId, queryReqPag>, res: Response) => {
        try {
            let queryAll: notStringQueryReqPag = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allPosts: null | resultPostObjectType = await queryRepository.getAllPostsOfBlog(req.params.id, queryAll, req.userID)

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
    async (req: queryReqType<queryReqPagOfSearchName>, res: Response) => {
        try {
            let queryAll: notStringQueryReqPagOfSearchName = {
                searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allBlogs: resultBlogObjectType = await queryRepository.getAllBlogs(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allBlogs)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })
