import {Request, Response, Router} from 'express';
import postController from '../controllers/post.controller';
import { indexMiddleware } from '../middleware/index.middleware';
import {requestQueryAll} from "../models/request.models";
import queryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";

const postRouter = Router({});

postRouter.get(
    '/:id',postController.getOne);

postRouter.post(
  '/',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.POSTS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  postController.create
);

postRouter.put(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  indexMiddleware.POSTS_VALIDATOR,
  indexMiddleware.ERRORS_VALIDATOR,
  postController.update
);

postRouter.delete(
  '/:id',
  indexMiddleware.BASIC_AUTHORIZATION,
  postController.delete
);

postRouter.get('/', async (req: Request<[],[],[],requestQueryAll>, res: Response) => {
    try {
        let pageNumber =  req.query.pageNumber ? req.query.pageNumber : '1'
        let pageSize =  req.query.pageSize ? req.query.pageSize : '10'
        let sortBy =  req.query.sortBy ? req.query.sortBy : 'createdAt'
        let sortDirection =  req.query.sortDirection ? req.query.sortDirection : 'desc'

        const posts = await queryService.getAllPosts(pageNumber, pageSize, sortBy, sortDirection);
        res.status(ERRORS_CODE.OK_200).json(posts);
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

export default postRouter;
