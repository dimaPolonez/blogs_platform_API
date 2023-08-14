import {Response, Router} from 'express';
import BlogController from './blog.controller';
import QueryService from "../../services/query.service";
import {ERRORS_CODE} from "../../core/db.data";
import {indexMiddleware} from "../../middleware";
import {
    NotStringQueryReqPagOfSearchNameType,
    NotStringQueryReqPagType,
    ParamsAndQueryReqType,
    ParamsIdType, QueryReqPagOfSearchNameType,
    QueryReqPagType, QueryReqType, ResultBlogObjectType,
    ResultPostObjectType
} from "../../core/models";

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
    async (
        req: ParamsAndQueryReqType<ParamsIdType, QueryReqPagType>,
        res: Response
    )=> {
        try {
            let queryAll: NotStringQueryReqPagType = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allPosts: null | ResultPostObjectType = await QueryService.getAllPostsOfBlog(req.params.id, queryAll, req.userId)

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
    async (
        req: QueryReqType<QueryReqPagOfSearchNameType>,
        res: Response
    ) => {
        try {
            let queryAll: NotStringQueryReqPagOfSearchNameType = {
                searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allBlogs: ResultBlogObjectType = await QueryService.getAllBlogs(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allBlogs)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })

export default blogRouter
