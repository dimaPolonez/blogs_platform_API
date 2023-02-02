import {indexMiddleware} from "../middleware/index.middleware";
import {Router} from "express";
import authController from "../controllers/auth.controller";


const authRouter = Router({});

authRouter.post('/login',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.authorization);

authRouter.post('/refresh-token',
    indexMiddleware.COOKIE_REFRESH,
    authController.refreshToken);

authRouter.post('/password-recovery',
    indexMiddleware.IP_BANNER,
    indexMiddleware.PASS_EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.createNewPass);

authRouter.post('/new-password',
    indexMiddleware.IP_BANNER,
    indexMiddleware.NEW_PASS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.updateNewPass);

authRouter.post('/registration-confirmation',
    indexMiddleware.IP_BANNER,
    indexMiddleware.CODE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.confirmEmail);

authRouter.post('/registration',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.registration);

authRouter.post('/registration-email-resending',
    indexMiddleware.IP_BANNER,
    indexMiddleware.EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    authController.resendingEmail);

authRouter.post('/logout',
    indexMiddleware.COOKIE_REFRESH,
    authController.logout);

authRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    authController.aboutMe);

export default authRouter;