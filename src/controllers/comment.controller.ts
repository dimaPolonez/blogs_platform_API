import {Response} from 'express';
import CommentService from "../services/comment.service";
import {ERRORS_CODE} from "../data/db.data";
import {paramsAndBodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {commentObjectResult, commentReqType} from "../models/comment.models";
import {likesReq} from '../models/likes.models';

class CommentController {

    public async getOneComment(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const comment: null | commentObjectResult = await CommentService.getOneComment(req.params.id, req.userID)

            if (comment) {
                res.status(ERRORS_CODE.OK_200).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateComment(req: paramsAndBodyReqType<paramsId, commentReqType>, res: Response) 
    {
        try {
            const comment: number = await CommentService.updateComment(req.params.id, req.body, req.userID)

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

    public async likeStatusComment(req: paramsAndBodyReqType<paramsId, likesReq>, res: Response) 
    {
        try {
            const likedComment: boolean = await CommentService.commentLike(req.body.likeStatus, req.params.id, req.user)

            if (likedComment) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    async deleteComment(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const deletedComment: number = await CommentService.deleteComment(req.params.id, req.userID)

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

export default new CommentController()
