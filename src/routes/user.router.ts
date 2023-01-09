import {Request, Response, Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import {queryAllUser, requestQueryUser} from "../models/request.models";
import queryService from "../services/query.service";
import {ERRORS_CODE} from "../data/db.data";
import userController from "../controllers/user.controller";

const userRouter = Router({});

userRouter.post('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.create);

userRouter.delete('/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    userController.delete);

userRouter.get('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    async (req: Request<{},{}, {}, requestQueryUser>, res: Response) => {
    try {

        let queryAll: queryAllUser = {
            sortBy: req.query.sortBy ? req.query.sortBy : 'createdAt',
            sortDirection: req.query.sortDirection ? req.query.sortDirection : 'desc',
            pageNumber: req.query.pageNumber ? +(req.query.pageNumber) : 1,
            pageSize: req.query.pageSize ? +(req.query.pageSize) : 10,
            searchLoginTerm: req.query.searchLoginTerm ? req.query.searchLoginTerm : '',
            searchEmailTerm: req.query.searchEmailTerm ? req.query.searchEmailTerm : ''
        }

        const users = await queryService.getAllUsers(queryAll);
        res.status(ERRORS_CODE.OK_200).json(users);
    } catch (e) {
        res.status(ERRORS_CODE.INTERNAL_SERVER_ERROR_500).json(e);
    }
})

export default userRouter;