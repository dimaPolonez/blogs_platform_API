import {Router} from "express";
import {indexMiddleware} from "../../middleware";
import userController from "./user.controller";

const userRouter = Router({})

userRouter.post('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.createUser
)

userRouter.delete('/:id',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.deleteUser
)

userRouter.get('/',
    indexMiddleware.BASIC_AUTHORIZATION,
    indexMiddleware.ERRORS_VALIDATOR,
    userController.getAllUsers)

export default userRouter