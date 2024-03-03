import { Router, Request, Response } from "express";
import requirelocalAuth from "@/middlewares/requireLocalAuth";
import { generateJWT, registerNewUser } from "@/services/auth";
import { Users } from "@prisma/client";
import { resSuccess } from "@/services/responses";

const localAuthRouter = Router();

localAuthRouter.post('/login', requirelocalAuth, (req: Request, res: Response) => {
    const token = generateJWT(req.user as Users);
    const user = req.user
    res.cookie('x-auth-token', token)
    resSuccess(res, 'Login successful', { user: user! })
})

localAuthRouter.post('/register', registerNewUser)
localAuthRouter.get('/logout', (req: Request, res: Response) => {
    req.logout(() => res.send('Logged out'))
})

export { localAuthRouter };