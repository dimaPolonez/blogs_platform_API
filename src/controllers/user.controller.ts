import {Response} from "express";
import {ERRORS_CODE} from "../data/db.data";
import {bodyReqType, paramsId, paramsReqType} from "../models/request.models";
import {userObjectResult, userReqType} from "../models/user.models";
import {userService} from "../services/user.service";

class UserController {

    public async createUser(req: bodyReqType<userReqType>, res: Response) {
        try {
            const user: userObjectResult = await userService.createUserAdmin(req.body)

            res.status(ERRORS_CODE.CREATED_201).json(user)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deleteUser(req: paramsReqType<paramsId>, res: Response) {
        try {
            const user: boolean = await userService.deleteUser(req.params.id)

            if (user) {
                res.sendStatus(ERRORS_CODE.NO_CONTENT_204)
                return
            }

            res.sendStatus(ERRORS_CODE.NOT_FOUND_404)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

}

export const userController = new UserController()