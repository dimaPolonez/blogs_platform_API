import {indexMiddleware} from "../middleware/index.middleware";
import {Router} from "express";
import authController from "../controllers/auth.controller";


const authRouter = Router({});

authRouter.post('/login',
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.authorization);

authRouter.post('/refresh-token',
    authController.refreshToken);

authRouter.post('/registration-confirmation',
    indexMiddleware.CODE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.confirmEmail);

authRouter.post('/registration',
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.registration);

authRouter.post('/registration-email-resending',
    indexMiddleware.EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.resendingEmail);

authRouter.post('/logout',
    authController.logout);

authRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    authController.aboutMe);

export default authRouter;