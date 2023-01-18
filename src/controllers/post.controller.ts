import {Response} from 'express';
import postService from '../services/post.service';
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import commentService from "../services/comment.service";
import {bodyReqType, paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {postObjectResult, postOfBlogReqType, postReqType} from "../models/post.models";
import {commentObjectResult} from "../models/comment.models";

class postController {

    async getOne(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);
            const post: false | postObjectResult = await postService.getOne(bodyId);

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
            const post: postObjectResult = await postService.create(req.body);

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

            const post: boolean = await postService.update(bodyId, req.body);

            if (post) {
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

            const post: boolean = await postService.delete(bodyId);

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
