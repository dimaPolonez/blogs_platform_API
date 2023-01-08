import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ERRORS_CODE} from "../data/db.data";
import userService from "../services/user.service";

class userController {

    async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);

            if (user) {
                res.status(ERRORS_CODE.CREATED_201).json(user);
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

            const user = await userService.delete(bodyId);

            if (user) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204);
            } else {
                res.sendStatus(ERRORS_CODE.NOT_FOUND_404);
            }
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
        }
    }

}
export default new userController();