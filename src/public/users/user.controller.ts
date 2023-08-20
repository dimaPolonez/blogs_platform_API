import {Response} from "express";
import {ERRORS_CODE} from "../../core/db.data";
import UserService from "./application/user.service";
import {
    BodyReqType, NotStringQueryReqPagSearchAuthType,
    ParamsIdType,
    ParamsReqType, QueryReqPagSearchAuthType, QueryReqType, ResultUserObjectType,
    UserObjectResultType,
    UserReqType
} from "../../core/models";
import UserQueryRepository from "./repository/user.query-repository";

class UserController {

    public async getAllUsers(
        req: QueryReqType<QueryReqPagSearchAuthType>,
        res: Response
    ){
        try {
            let queryAll: NotStringQueryReqPagSearchAuthType = {
                searchLoginTerm: req.query.searchLoginTerm ? req.query.searchLoginTerm : '',
                searchEmailTerm: req.query.searchEmailTerm ? req.query.searchEmailTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const allUsers: ResultUserObjectType = await UserQueryRepository.getAllUsers(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allUsers)
        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    }

    public async createUser(
        req: BodyReqType<UserReqType>,
        res: Response
    ){
        try {
            const userId: string = await UserService.createUser(req.body)

            const user: UserObjectResultType | null = await UserQueryRepository.getOneUser(userId)

            if (user) {
                res.status(ERRORS_CODE.CREATED_201).json(user)
            }
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