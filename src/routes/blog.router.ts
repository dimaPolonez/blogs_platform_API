import {Response, Router} from 'express';
import blogController from '../controllers/blog.controller';
import {indexMiddleware} from '../middleware/index.middleware';
import queryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import {
    notStringQueryReqPag, notStringQueryReqPagOfSearchName,
    paramsAndQueryReqType, paramsId, queryReqPag, queryReqPagOfSearchName,
    queryReqType
} from '../models/request.models';
import {resultBlogObjectType} from '../models/blog.models';
import {resultPostObjectType} from '../models/post.models';

const blogRouter = Router({});

blogRouter.get(
    '/:id', blogController.getOne);

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

blogRouter.post(
    '/:id/posts',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_OF_BLOG_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    blogController.createOnePostOfBlog
);


blogRouter.get('/:id/posts', async (req: paramsAndQueryReqType<paramsId, queryReqPag>, res: Response) => {
    try {

        let queryAll: notStringQueryReqPag = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const bodyId: ObjectId = new ObjectId(req.params.id);

        const post: false | resultPostObjectType = await queryService.getAllPostsOfBlog(bodyId, queryAll);

        if (post) {
            res.status(ERRORS_CODE.OK_200).json(post);
        } else {
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        }
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

blogRouter.get('/', async (req: queryReqType<queryReqPagOfSearchName>, res: Response) => {
    try {

        let queryAll: notStringQueryReqPagOfSearchName = {
            searchNameTerm: req.query.searchNameTerm ? req.query.searchNameTerm : '',
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const blogs: resultBlogObjectType = await queryService.getAllBlogs(queryAll);
        res.status(ERRORS_CODE.OK_200).json(blogs);
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

export default blogRouter;
