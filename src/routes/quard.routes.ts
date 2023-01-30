import {Router} from "express";
import guardController from "../controllers/guard.controller";
import {indexMiddleware} from "../middleware/index.middleware";


const guardRouter = Router({});

guardRouter.get('/devices',
    indexMiddleware.COOKIE_REFRESH,
    guardController.getAllSessions);

guardRouter.delete('/devices',
    indexMiddleware.COOKIE_REFRESH,
    guardController.killAllSessions);

guardRouter.delete('/devices/{deviceId}',
    indexMiddleware.COOKIE_REFRESH,
    guardController.killOneSession);

export default guardRouter;