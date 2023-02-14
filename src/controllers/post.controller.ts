import {Response} from 'express';
import postService from '../services/post.service';
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import commentService from "../services/comment.service";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import {commentObjectResult} from "../models/comment.models";
import { likesReq } from '../models/likes.models';

class postController {

    async getOne(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);
            const post: false | postObjectResult = await postService.getOnePost(bodyId, req.userId);

            if (post) {
                res.status(ERRORS_CODE.OK_200).json(post);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async create(req: bodyReqType<postReqType>, res: Response) {
        try {
            const post: postObjectResult = await postService.createPost(req.body);

            if (post) {
                res.status(ERRORS_CODE.CREATED_201).json(post);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async update(req: paramsAndBodyReqType<paramsId, postReqType>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const post: boolean = await postService.updatePost(bodyId, req.body);

            if (post) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async likeStatus(req: paramsAndBodyReqType<paramsId, likesReq>, res: Response) {
        try {
            const postId: ObjectId = new ObjectId(req.params.id);

            const likeStatus: string = req.body.likeStatus;

            const like: boolean = await postService.postLike(likeStatus, postId, req.user);

            if (like) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async delete(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const post: boolean = await postService.deletePost(bodyId);

            if (post) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async createCommentOfPost(req: paramsAndBodyReqType<paramsId, postOfBlogReqType>, res: Response) {
        try {
            const postId: ObjectId = new ObjectId(req.params.id);

            const comment: false | commentObjectResult = await commentService.createCommentOfPost(postId, req.body, req.user);

            if (comment) {
                res.status(ERRORS_CODE.CREATED_201).json(comment);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }
}

export default new postController();
