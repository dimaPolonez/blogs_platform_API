import {Request, Response} from 'express';
import {ERRORS_CODE} from "../../core/db.data";
import {ParamsIdType, ParamsReqType, ReturnActiveDeviceType} from "../../core/models";
import SessionsQueryRepository from "./repository/sessions.query-repository";
import SessionsService from "./application/sessions.service";

class SessionsController {

    public async getAllSessions(
        req: Request,
        res: Response
    ){
        try {
            const activeDevice: ReturnActiveDeviceType[] = await
                SessionsQueryRepository.getAllSessions(req.user._id)

            res.status(ERRORS_CODE.OK_200).json(activeDevice)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async killAllSessions(
        req: Request,
        res: Response
    ){
        try {
            await SessionsService.killAllSessions(req.sessionId, req.user._id)

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
            const killedSession: number = await
                SessionsService.killOneSession(req.params.id, req.user._id)

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