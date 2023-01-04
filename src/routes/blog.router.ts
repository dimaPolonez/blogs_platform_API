import {Request, Response, Router} from 'express';
import blogController from '../controllers/blog.controller';
import { indexMiddleware } from '../middleware/index.middleware';
import {requestQueryAll} from "../models/request.models";
import queryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";

const blogRouter = Router({});

blogRouter.get(
    '/:id',blogController.getOne);

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


blogRouter.get('/:id/posts', async (req: Request<{id: string},[],[],requestQueryAll>, res: Response) => {
    try {
        let pageNumber =  req.query.pageNumber ? req.query.pageNumber : '1'
        let pageSize =  req.query.pageSize ? req.query.pageSize : '10'
        let sortBy =  req.query.sortBy ? req.query.sortBy : 'createdAt'
        let sortDirection =  req.query.sortDirection ? req.query.sortDirection : 'desc'

        const bodyId: ObjectId = new ObjectId(req.params.id);

        const post = await queryService.getAllPostsOfBlog(bodyId, pageNumber,
            pageSize, sortBy, sortDirection);

        if (post) {
            res.status(ERRORS_CODE.OK_200).json(post);
        } else {
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
        }
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

blogRouter.get('/', async (req: Request<[],[], {},requestQueryAll>, res: Response) => {
    try {
        let searchNameTerm =  req.query.searchNameTerm ? req.query.searchNameTerm : 'null'
        let pageNumber =  req.query.pageNumber ? req.query.pageNumber : '1'
        let pageSize =  req.query.pageSize ? req.query.pageSize : '10'
        let sortBy =  req.query.sortBy ? req.query.sortBy : 'createdAt'
        let sortDirection =  req.query.sortDirection ? req.query.sortDirection : 'desc'

        const blogs = await queryService.getAllBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection);
        res.status(ERRORS_CODE.OK_200).json(blogs);
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

export default blogRouter;
