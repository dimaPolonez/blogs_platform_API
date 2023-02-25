import {Response, Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import {ERRORS_CODE} from "../data/db.data";
import {notStringQueryReqPagSearchAuth, queryReqPagSearchAuth, queryReqType} from "../models/request.models";
import {resultUserObjectType} from "../models/user.models";
import {userController} from "../controllers/user.controller";
import {queryRepository} from "../data/repository/query.repository";

export const userRouter = Router({})

userRouter.post('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.createUser
)

userRouter.delete('/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.deleteUser
)

userRouter.get('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    async (req: queryReqType<queryReqPagSearchAuth>, res: Response) => {
        try {
            let queryAll: notStringQueryReqPagSearchAuth = {
                searchLoginTerm: req.query.searchLoginTerm ? req.query.searchLoginTerm : '',
                searchEmailTerm: req.query.searchEmailTerm ? req.query.searchEmailTerm : '',
                sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
                sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
                pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
                pageSize: req.query.pageSize ? +(req.query.pageSize) : 10
            }

            const allUsers: resultUserObjectType = await queryRepository.getAllUsers(queryAll)

            res.status(ERRORS_CODE.OK_200).json(allUsers)

        } catch (e) {
            res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e)
        }
    })