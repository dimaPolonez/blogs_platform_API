import {Request, Response} from 'express';
import commentService from "../services/comment.service";
import {ERRORS_CODE} from "../data/db.data";
import {ObjectId} from "mongodb";

class commentController {

    async getOne(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment: object = await commentService.getOne(bodyId);

            if (comment) {
                res.status(ERRORS_CODE.OK_200).json(comment);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment = await commentService.update(bodyId, req.body);

            if (comment) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const bodyId: ObjectId = new ObjectId(req.params.id);

            const comment = await commentService.delete(bodyId);

            if (comment) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }
}

export default new commentController();
