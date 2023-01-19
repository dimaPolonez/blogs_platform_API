import {indexMiddleware} from "../middleware/index.middleware";
import {Router} from "express";
import authController from "../controllers/auth.controller";


const authRouter = Router({});

authRouter.post('/login',
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.authorization);

authRouter.post('/registration-confirmation',
    authController.confirmEmail);

authRouter.post('/registration',
    authController.registration);

authRouter.post('/registration-email-resending',
    authController.resendingEmail);

authRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    authController.aboutMe);

export default authRouter;