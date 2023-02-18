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
    indexMiddleware.PARAMS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    GuardController.killOneSession
)

export default guardRouter