import {Router} from "express";
import GuardController from "../controllers/guard.controller";
import {indexMiddleware} from "../middleware/index.middleware";


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