import { Router, Request, Response } from "express";
import requirelocalAuth from "@/middlewares/auth/requireLocalAuth";
import { login, logout, registerNewUser } from "@/controllers/auth.controller"
import { resSuccess } from "@/services/responses";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { resetPassword, setPassword, verifyChangePasswordRequest } from "@/controllers/auth.controller";
import { Users } from "@prisma/client";

const localAuthRouter = Router();

localAuthRouter.post('/login',
    requirelocalAuth,
    login
)

localAuthRouter.post('/register',
    registerNewUser
)

localAuthRouter.get('/logout',
    logout
)

localAuthRouter.get('/verify-token',
    requireJwtAuth,
    (req: Request, res: Response) => {
        resSuccess(res, 'Authenticated', { user: req.user as Users }, 1)
    }
)

localAuthRouter.post('/set-password',
    requireJwtAuth,
    setPassword
)

localAuthRouter.post('/reset-password',
    resetPassword
)

localAuthRouter.get('/reset-password/verify-request',
    requireJwtAuth,
    verifyChangePasswordRequest
)

localAuthRouter.patch('/reset-password/set-new-password',
    requireJwtAuth,
    setPassword)

export { localAuthRouter };