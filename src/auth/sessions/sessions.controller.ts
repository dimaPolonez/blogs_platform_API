import {Request, Response} from 'express';
import {ERRORS_CODE} from "../../core/db.data";
import GuardService from './application/sessions.service';
import {ParamsIdType, ParamsReqType, ReturnActiveDeviceType} from "../../core/models";

class SessionsController {

    public async getAllSessions(
        req: Request,
        res: Response
    ){
        try {
            const activeDevice: ReturnActiveDeviceType[] = await GuardService.allActiveSessions(req.user._id)

            res.status(ERRORS_CODE.OK_200).json(activeDevice)
            return
            
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async killAllSessions(
        req: Request,
        res: Response
    ){
        try {
            await GuardService.killAllSessions(req.sessionId, req.user)

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async killOneSession(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
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

export default new SessionsController()