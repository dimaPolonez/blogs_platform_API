import {Request, Response} from 'express';
import {ERRORS_CODE} from "../data/db.data";
import {returnActiveDevice} from '../models/activeDevice.models';
import {paramsId, paramsReqType} from '../models/request.models';
import GuardService from '../services/guard.service';

class GuardController {

    public async getAllSessions(req: Request, res: Response) 
    {
        try {
            const activeDevice: null | returnActiveDevice = await GuardService.allActiveSessions(req.user._id)

            res.status(ERRORS_CODE.OK_200).json(activeDevice)
            return
            
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async killAllSessions(req: Request, res: Response) 
    {
        try {
            await GuardService.killAllSessions(req.sessionId, req.user)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async killOneSession(req: paramsReqType<paramsId>, res: Response) 
    {
        try {
            const killedSession: number = await GuardService.killOneSession(req.params.id, req.user)

            switch (killedSession) {
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

export default new GuardController()