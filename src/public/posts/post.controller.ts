import {Response} from 'express';
import PostService from './application/post.service';
import {ERRORS_CODE} from "../../core/db.data";
import {
    BodyReqType, CommentObjectResultType, LikesReqType, NotStringQueryReqPagType,
    ParamsAndBodyReqType, ParamsAndQueryReqType,
    ParamsIdType,
    ParamsReqType,
    PostObjectResultType, PostOfBlogReqType,
    PostReqType, QueryReqPagType, QueryReqType, ResultCommentObjectType, ResultPostObjectType
} from "../../core/models";
import PostQueryRepository from "./repository/post.query-repository";
import CommentQueryRepository from "../comments/repository/comment.query-repository";

class PostController {

    public async getOnePost(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const post: PostObjectResultType | null = await
                PostQueryRepository.getOnePost(req.params.id, req.userId)

            if (post) {
                res.status(ERRORS_CODE.OK_200).json(post)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async getAllPost(
    req: QueryReqType<QueryReqPagType>,
    res: Response
    ){
        try {
            let queryAll: NotStringQueryReqPagType = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
                pageSize: req.query.pageSize ? +req.query.pageSize : 10
            }

            const allPosts: ResultPostObjectType = await
                PostQueryRepository.getAllPosts(queryAll, req.userId)

            res.status(ERRORS_CODE.OK_200).json(allPosts)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createPost(
        req: BodyReqType<PostReqType>,
        res: Response
    ){
        try {
            const postId: string = await
                PostService.createPost(req.body)

            const post: PostObjectResultType | null = await
                PostQueryRepository.getOnePost(postId)

            res.status(ERRORS_CODE.CREATED_201).json(post)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updatePost(
        req: ParamsAndBodyReqType<ParamsIdType, PostReqType>,
        res: Response
    ){
        try {
            const updatedPost: boolean = await
                PostService.updatePost(req.params.id, req.body)

            if (updatedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async likeStatusPost(
        req: ParamsAndBodyReqType<ParamsIdType, LikesReqType>,
        res: Response
    ){
        try {
            const likedPost: boolean = await
                PostService.postLike(req.body.likeStatus, req.params.id, req.user)

            if (likedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deletePost(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const deletedPost: boolean = await
                PostService.deletePost(req.params.id)

            if (deletedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createCommentOfPost(
        req: ParamsAndBodyReqType<ParamsIdType, PostOfBlogReqType>,
        res: Response
    ){
        try {
            const commentId: string | null = await
                PostService.createCommentOfPost(req.params.id, req.body, req.user)

            if (commentId) {
                const comment: CommentObjectResultType | null =
                    await CommentQueryRepository.getOneComment(commentId)

                res.status(ERRORS_CODE.CREATED_201).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async getAllCommentsOfPost(
        req: ParamsAndQueryReqType<ParamsIdType, QueryReqPagType>,
        res: Response
    ){
        try {
            let queryAll: NotStringQueryReqPagType = {
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const findPost: PostObjectResultType | null = await PostQueryRepository.getOnePost(req.params.id)

            if (findPost) {
                const allComments: ResultCommentObjectType =
                    await CommentQueryRepository.getAllCommentsOfPost(req.params.id, queryAll, req.userId)

                res.status(ERRORS_CODE.OK_200).json(allComments)
                return
            }
            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }
}

export default new PostController()
