import { Router, Request, Response, NextFunction } from "express";
import requirelocalAuth from "@/middlewares/requireLocalAuth";
import { generateJWT, registerNewUser } from "@/services/auth";
import { Users } from "@prisma/client";
import { resSuccess } from "@/services/responses";
import { requireJwtAuth } from "@/middlewares/requireJwtAuth";

const localAuthRouter = Router();

localAuthRouter.post('/login', requirelocalAuth, (req: Request, res: Response) => {
    const token = generateJWT(req.user as Users);
    const user = req.user
    console.log(token, user)
    res.cookie('palugada-auth-token', token)
    resSuccess(res, 'Login successful', { user: user! }, 1)
})

localAuthRouter.post('/register', registerNewUser)

localAuthRouter.get('/logout', (req: Request, res: Response) => {
    req.logout(() => res.send('Logged out'))
})

localAuthRouter.get('/authenticate',
    requireJwtAuth,
    (req: Request, res: Response) => {
        resSuccess(res, 'Authenticated', { user: req.user! }, 1)
    }
)

export { localAuthRouter };