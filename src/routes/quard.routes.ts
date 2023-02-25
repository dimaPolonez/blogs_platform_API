import {Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import {guardController} from "../controllers/guard.controller";


export const guardRouter = Router({})

guardRouter.get('/devices',
    indexMiddleware.COOKIE_REFRESH,
    guardController.getAllSessions
)

guardRouter.delete('/devices',
    indexMiddleware.COOKIE_REFRESH,
    guardController.killAllSessions
)

guardRouter.delete('/devices/:id',
    indexMiddleware.COOKIE_REFRESH,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    guardController.killOneSession
)