import {Response, Router} from 'express';
import PostController from '../controllers/post.controller';
import {indexMiddleware} from '../middleware/index.middleware';
import {
    notStringQueryReqPag,
    paramsAndQueryReqType, paramsId,
    queryReqPag,
    queryReqType
} from "../models/request.models";
import QueryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import {resultPostObjectType} from '../models/post.models';
import {resultCommentObjectType} from "../models/comment.models";
import QueryRepository from '../data/repository/query.repository';

const postRouter = Router({})

postRouter.get(
    '/:id', 
    indexMiddleware.USER_ID,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.getOnePost
)

postRouter.post(
    '/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.createPost
)

postRouter.put(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.POSTS_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.updatePost
)

postRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.likeStatusPost
)

postRouter.delete(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.deletePost
)

postRouter.post('/:id/comments',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.createCommentOfPost
)

postRouter.get('/', 
    indexMiddleware.USER_ID,
    async (req: queryReqType<queryReqPag>, res: Response) => 
    {
        try {

        let queryAll: notStringQueryReqPag = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const allPosts: resultPostObjectType = await QueryRepository.getAllPosts(queryAll, req.userID)

        res.status(ERRORS_CODE.OK_200).json(allPosts)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
    })

postRouter.get('/:id/comments',
    indexMiddleware.USER_ID,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: paramsAndQueryReqType<paramsId, queryReqPag>, res: Response) => 
    {
        try {
            let queryAll: notStringQueryReqPag = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const allComments: null | resultCommentObjectType = await QueryService.getAllCommentsOfPost(req.params.id, queryAll, req.userID)
            
            if (allComments) {
                res.status(ERRORS_CODE.OK_200).json(allComments)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })

export default postRouter
