import {Response, Router} from 'express';
import PostController from './post.controller';
import QueryService from "../../services/query.service";
import {ERRORS_CODE} from "../../core/db.data";
import {indexMiddleware} from "../../middleware";
import {
    NotStringQueryReqPagType,
    ParamsAndQueryReqType, ParamsIdType,
    QueryReqPagType,
    QueryReqType, ResultCommentObjectType,
    ResultPostObjectType
} from "../../core/models";

const postRouter = Router({})

postRouter.get(
    '/:id', 
    indexMiddleware.USER_ID,
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
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.updatePost
)

postRouter.put('/:id/like-status',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.LIKE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.likeStatusPost
)

postRouter.delete(
    '/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.deletePost
)

postRouter.post('/:id/comments',
    indexMiddleware.BEARER_AUTHORIZATION,
    indexMiddleware.COMMENT_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    PostController.createCommentOfPost
)

postRouter.get('/',
    indexMiddleware.USER_ID,
    async (
        req: QueryReqType<QueryReqPagType>,
        res: Response
    ) => {
        try {

        let queryAll: NotStringQueryReqPagType = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
            pageSize: req.query.pageSize ? +req.query.pageSize : 10
        }

        const allPosts: ResultPostObjectType = await QueryService.getAllPosts(queryAll, req.userId)

        res.status(ERRORS_CODE.OK_200).json(allPosts)

    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
    }
    })

postRouter.get('/:id/comments',
    indexMiddleware.USER_ID,
    async (
        req: ParamsAndQueryReqType<ParamsIdType, QueryReqPagType>,
        res: Response
    ) => {
        try {
            let queryAll: NotStringQueryReqPagType = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const allComments: null | ResultCommentObjectType = await QueryService.getAllCommentsOfPost(req.params.id, queryAll, req.userId)
            
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
