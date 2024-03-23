import { Router, Request, Response } from "express";
import requirelocalAuth from "@/middlewares/auth/requireLocalAuth";
import { generateJWT, registerNewUser } from "@/services/auth/auth";
import { Users } from "@prisma/client";
import { resSuccess } from "@/services/responses";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { resetPassword, setPassword, verifyChangePasswordRequest } from "@/controllers/auth.controller";

const localAuthRouter = Router();

localAuthRouter.post('/login',
    requirelocalAuth,
    (req: Request, res: Response) => {
        const token = generateJWT(req.user as Users);
        const user = req.user
        res.cookie('palugada-auth-token', token, { maxAge: 1000 * 60 * 60 * 24 })
        resSuccess(res, 'Login successful', { user: user! }, 1)
    }
)

localAuthRouter.post('/register', registerNewUser)

localAuthRouter.get('/logout',
    (req: Request, res: Response) => {
        req.logout(() => res.send('Logged out'))
    })

localAuthRouter.get('/verify-token',
    requireJwtAuth,
    (req: Request, res: Response) => {
        resSuccess(res, 'Authenticated', { user: req.user! }, 1)
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