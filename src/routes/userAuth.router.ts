import {indexMiddleware} from "../middleware/index.middleware";
import {Router} from "express";
import {userAuthController} from "../controllers/userAuth.controller";


export const userAuthRouter = Router({})

userAuthRouter.post('/login',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USER_AUTH,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.authorization
)

userAuthRouter.post('/refresh-token',
    indexMiddleware.COOKIE_REFRESH,
    userAuthController.refreshToken
)

userAuthRouter.post('/password-recovery',
    indexMiddleware.IP_BANNER,
    indexMiddleware.PASS_EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.createNewPass
)

userAuthRouter.post('/new-password',
    indexMiddleware.IP_BANNER,
    indexMiddleware.NEW_PASS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.updateNewPass
)

userAuthRouter.post('/registration-confirmation',
    indexMiddleware.IP_BANNER,
    indexMiddleware.CODE_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.confirmEmail
)

userAuthRouter.post('/registration',
    indexMiddleware.IP_BANNER,
    indexMiddleware.USERS_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.registration
)

userAuthRouter.post('/registration-email-resending',
    indexMiddleware.IP_BANNER,
    indexMiddleware.EMAIL_VALIDATOR,
    indexMiddleware.ERRORS_VALIDATOR,
    userAuthController.resendingEmail
)

userAuthRouter.post('/logout',
    indexMiddleware.COOKIE_REFRESH,
    userAuthController.logout
)

userAuthRouter.get('/me',
    indexMiddleware.BEARER_AUTHORIZATION,
    userAuthController.aboutMe
)