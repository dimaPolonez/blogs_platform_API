import {Request, Response} from 'express';
import {ERRORS_CODE} from "../data/db.data";

class guardController {

    async getAllSessions(req: Request, res: Response) {
        try {


            res.status(ERRORS_CODE.OK_200).json()
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async killAllSessions(req: Request, res: Response) {
        try {

            res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

    async killOneSession(req: Request, res: Response) {
        try {

            const killedSession = 204 | 403 | 404;

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