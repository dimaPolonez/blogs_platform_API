import {Response, Router} from 'express';
import postController from '../controllers/post.controller';
import {indexMiddleware} from '../middleware/index.middleware';
import {
    notStringQueryReqPag,
    paramsAndQueryReqType, paramsId,
    queryReqPag,
    queryReqType
} from "../models/request.models";
import queryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import {resultPostObjectType} from '../models/post.models';
import {resultCommentObjectType} from "../models/comment.models";

const postRouter = Router({});

postRouter.get(
    '/:id', postController.getOne);

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

postRouter.post('/:id/comments',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    postController.createCommentOfPost);

postRouter.get('/', async (req: queryReqType<queryReqPag>, res: Response) => {
    try {

        let queryAll: notStringQueryReqPag = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const posts: resultPostObjectType = await queryService.getAllPosts(queryAll);

        res.status(ERRORS_CODE.OK_200).json(posts);
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

postRouter.get('/:id/comments',
    indexMiddleware.USER_ID,
    async (req: paramsAndQueryReqType<paramsId, queryReqPag>, res: Response) => {
        try {

            let queryAll: notStringQueryReqPag = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const postId: ObjectId = new ObjectId(req.params.id);

            const comments: false | resultCommentObjectType = await queryService.getAllCommentsOfBlog(postId, queryAll, req.userId);
            if (comments) {
                res.status(ERRORS_CODE.OK_200).json(comments);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    })

export default postRouter;
