import {Request, Response} from 'express';
import { ObjectId } from 'mongodb';
import {ERRORS_CODE} from "../data/db.data";
import { returnActiveDevice } from '../models/activeDevice.models';
import { paramsId, paramsReqType } from '../models/request.models';
import guardService from '../services/guard.service';

class guardController {

    async getAllSessions(req: Request, res: Response) {
        try {

            const activeDevice: returnActiveDevice [] = await guardService.allActiveDevice(req.user._id);

            res.status(ERRORS_CODE.OK_200).json(activeDevice)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async killAllSessions(req: Request, res: Response) {
        try {

            await guardService.killAllSessions(req.user);

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async killOneSession(req: paramsReqType<paramsId>, res: Response) {
        try {

            const sessionId: ObjectId = new ObjectId(req.params.id);

            const killedSession: number = await guardService.killOneSession(sessionId, req.user);

            switch (killedSession) {
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

export default new guardController();