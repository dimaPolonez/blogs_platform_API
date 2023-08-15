import {Response} from "express";
import {ERRORS_CODE} from "../../core/db.data";
import UserService from "./application/user.service";
import {
    AuthParamsType,
    BodyReqType,
    ParamsIdType,
    ParamsReqType,
    UserObjectResultType,
    UserReqType
} from "../../core/models";

class UserController {

    public async createUser(
        req: BodyReqType<UserReqType>,
        res: Response
    ){
        try {
            const authParams: AuthParamsType = {
                confirm: true,
                codeActivated: 'Activated',
                lifeTimeCode: 'Activated'
            } 

            const user: UserObjectResultType = await UserService.createUser(req.body, authParams)

            res.status(ERRORS_CODE.CREATED_201).json(user)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async deleteUser(
        req: ParamsReqType<ParamsIdType>,
        res: Response
    ){
        try {
            const user: boolean = await UserService.deleteUser(req.params.id)

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

export default new UserController()