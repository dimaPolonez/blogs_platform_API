import {Router} from "express";
import {indexMiddleware} from "../middleware/index.middleware";
import {userSessionController} from "../controllers/userSession.controller";


export const guardRouter = Router({})

guardRouter.get('/devices',
    indexMiddleware.COOKIE_REFRESH,
    userSessionController.getAllSessions
)

guardRouter.delete('/devices',
    indexMiddleware.COOKIE_REFRESH,
    userSessionController.killAllSessions
)

guardRouter.delete('/devices/:id',
    indexMiddleware.COOKIE_REFRESH,
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userSessionController.killOneSession
)