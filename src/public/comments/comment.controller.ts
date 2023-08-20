import {Response} from 'express';
import CommentService from "./application/comment.service";
import {ERRORS_CODE} from "../../core/db.data";
import {
    CommentObjectResultType,
    CommentReqType, LikesReqType,
    ParamsAndBodyReqType,
    ParamsIdType,
    ParamsReqType
} from "../../core/models";
import CommentQueryRepository from "./repository/comment.query-repository";

class CommentController {

    public async getOneComment(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const comment: CommentObjectResultType | null = await CommentQueryRepository.getOneComment(req.params.id, req.userId)

            if (comment) {
                res.status(ERRORS_CODE.OK_200).json(comment)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async updateComment(
        req: ParamsAndBodyReqType<ParamsIdType, CommentReqType>,
        res: Response
    ){
        try {
            const comment: number = await CommentService.updateComment(req.params.id, req.body, req.user)

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

    public async likeStatusComment(
        req: ParamsAndBodyReqType<ParamsIdType, LikesReqType>,
        res: Response
    ){
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

    async deleteComment(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const deletedComment: number = await CommentService.deleteComment(req.params.id, req.user)

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
