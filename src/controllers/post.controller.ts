import {Response} from 'express';
import PostService from '../services/post.service';
import {ERRORS_CODE} from "../data/db.data";
import CommentService from "../services/comment.service";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {postObjectResult, postReqType} from "../models/post.models";
import {commentObjectResult, commentReqType} from "../models/comment.models";
import { likesReq } from '../models/likes.models';

class PostController {

    public async getOnePost(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const post: null | postObjectResult = await PostService.getOnePost(req.params.id, req.userID)

            if (post) {
                res.status(ERRORS_CODE.OK_200).json(post)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createPost(req: bodyReqType<postReqType>, res: Response) 
    {
        try {
            const post: postObjectResult = await PostService.createPost(req.body)

            res.status(ERRORS_CODE.CREATED_201).json(post)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updatePost(req: paramsAndBodyReqType<paramsId, postReqType>, res: Response) 
    {
        try {
            const updatedPost: boolean = await PostService.updatePost(req.params.id, req.body)

            if (updatedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async likeStatusPost(req: paramsAndBodyReqType<paramsId, likesReq>, res: Response) 
    {
        try {
            const likedPost: boolean = await PostService.postLike(req.body.likeStatus, req.params.id, req.userID)

            if (likedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deletePost(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const deletedPost: boolean = await PostService.deletePost(req.params.id)

            if (deletedPost) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createCommentOfPost(req: paramsAndBodyReqType<paramsId, commentReqType>, res: Response) 
    {
        try {
            const comment: null | commentObjectResult = await CommentService.createCommentOfPost(req.params.id, req.body, req.userID)

            if (comment) {
                res.status(ERRORS_CODE.CREATED_201).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }
}

export default new PostController()
