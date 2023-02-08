import {Response} from 'express';
import commentService from "../services/comment.service";
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";
import {paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {commentObjectResult, commentReqType} from "../models/comment.models";
import { likesReq } from '../models/likes.models';

class commentController {

    async getOne(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment: false | commentObjectResult = await commentService.getOne(bodyId, req.userId);

            if (comment) {
                res.status(ERRORS_CODE.OK_200).json(comment);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async update(req: paramsAndBodyReqType<paramsId, commentReqType>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment: number = await commentService.update(bodyId, req.body, req.user);

            switch (comment) {
                case (204):
                    return res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
                    break;
                case (403):
                    return res.sendStatus(ERRORS_CODE.NOT_YOUR_OWN_403);
                    break;
                case (404):
                    return res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
                    break;
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async likeStatus(req: paramsAndBodyReqType<paramsId, likesReq>, res: Response) {
        try {
            const commentId: ObjectId = new ObjectId(req.params.id);

            const likeStatus: string = req.body.likeStatus;

            const like: boolean = await commentService.commentLike(likeStatus, commentId, req.user); 

            if (like) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch(e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async delete(req: paramsReqType<paramsId>, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment: number = await commentService.delete(bodyId, req.user);

            switch (comment) {
                case (204):
                    return res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
                    break;
                case (403):
                    return res.sendStatus(ERRORS_CODE.NOT_YOUR_OWN_403);
                    break;
                case (404):
                    return res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
                    break;
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }
}

export default new commentController();
