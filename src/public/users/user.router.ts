import {Response, Router} from "express";
import QueryService from "../../services/query.service";
import {ERRORS_CODE} from "../../core/db.data";
import UserController from "./user.controller";
import {indexMiddleware} from "../../middleware";
import {
    NotStringQueryReqPagSearchAuthType,
    QueryReqPagSearchAuthType,
    QueryReqType,
    ResultUserObjectType
} from "../../core/models";

const userRouter = Router({})

userRouter.post('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    UserController.createUser
)

userRouter.delete('/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    UserController.deleteUser
)

userRouter.get('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    async (
        req: QueryReqType<QueryReqPagSearchAuthType>,
        res: Response
    ) => {
        try {
            let queryAll: NotStringQueryReqPagSearchAuthType = {
                searchLoginTerm: req.query.searchLoginTerm ? req.query.searchLoginTerm : '',
                searchEmailTerm: req.query.searchEmailTerm ? req.query.searchEmailTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const allUsers: ResultUserObjectType = await QueryService.getAllUsers(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allUsers)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })

export default userRouter