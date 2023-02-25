import {Response} from 'express';
import {ERRORS_CODE} from "../data/db.data";
import {paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {commentObjectResult, commentReqType} from "../models/comment.models";
import {likesReq} from '../models/likes.models';
import {commentService} from "../services/comment.service";

class CommentController {

    public async getOneComment(req: paramsReqType<paramsId>, res: Response) {
        try {
            const comment: null | commentObjectResult = await commentService.getOneComment(req.params.id, req.userID)

            if (comment) {
                res.status(ERRORS_CODE.OK_200).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateComment(req: paramsAndBodyReqType<paramsId, commentReqType>, res: Response) {
        try {
            const comment: number = await commentService.updateComment(req.params.id, req.body, req.userID)

            switch (comment) {
                case (204):
                    return res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                case (403):
                    return res.sendStatus(ERRORS_CODE.NOT_YOUR_OWN_403)
                case (404):
                    return res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
            }

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async likeStatusComment(req: paramsAndBodyReqType<paramsId, likesReq>, res: Response) {
        try {
            const likedComment: boolean = await commentService.commentLike(req.body.likeStatus, req.params.id, req.userID)

            if (likedComment) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    async deleteComment(req: paramsReqType<paramsId>, res: Response) {
        try {
            const deletedComment: number = await commentService.deleteComment(req.params.id, req.userID)

            switch (deletedComment) {
                case (204):
                    return res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                case (403):
                    return res.sendStatus(ERRORS_CODE.NOT_YOUR_OWN_403)
                case (404):
                    return res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
            }

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }
}

export const commentController = new CommentController()
