import {Router} from "express";
import GuardController from "./sessions.controller";
import {indexMiddleware} from "../../middleware";


const guardRouter = Router({})

guardRouter.get('/devices',
    indexMiddleware.COOKIE_REFRESH,
    GuardController.getAllSessions
)

guardRouter.delete('/devices',
    indexMiddleware.COOKIE_REFRESH,
    GuardController.killAllSessions
)

guardRouter.delete('/devices/:id',
    indexMiddleware.COOKIE_REFRESH,
    GuardController.killOneSession
)

export default guardRouter