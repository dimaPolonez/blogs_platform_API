import {indexMiddleware} from "../middleware/index.middleware";
import {Router} from "express";
import AuthController from "../controllers/auth.controller";


const authRouter = Router({})

authRouter.post('/login',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.authorization
)

authRouter.post('/refresh-token',
    indexMiddleware.COOKIE_REFRESH,
    AuthController.refreshToken
)

authRouter.post('/password-recovery',
    indexMiddleware.IP_BANNER,
    indexMiddleware.PASS_EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.createNewPass
)

authRouter.post('/new-password',
    indexMiddleware.IP_BANNER,
    indexMiddleware.NEW_PASS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.updateNewPass
)

authRouter.post('/registration-confirmation',
    indexMiddleware.IP_BANNER,
    indexMiddleware.CODE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.confirmEmail
)

authRouter.post('/registration',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.registration
)

authRouter.post('/registration-email-resending',
    indexMiddleware.IP_BANNER,
    indexMiddleware.EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    AuthController.resendingEmail
)

authRouter.post('/logout',
    indexMiddleware.COOKIE_REFRESH,
    AuthController.logout
)

authRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    AuthController.aboutMe
)

export default authRouter