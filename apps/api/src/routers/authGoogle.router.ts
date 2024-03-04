import { requireJwtAuth } from "@/middlewares/requireJwtAuth";
import { generateJWT } from "@/services/auth";
import { Users } from "@prisma/client";
import { Router } from "express";
import { Request, Response } from "express";
import passport from "passport";

const googleAuthRouter = Router();

googleAuthRouter.get('/', (req: Request, res: Response) => {
    res.send('Auth route')
})
googleAuthRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }
    ));

googleAuthRouter.get(
    '/google/callback',
    passport.authenticate('google',
        {
            failureRedirect: '/auth/google/failed',
            session: false
        }),
    function (req: Request, res: Response) {
        const token = generateJWT(req.user as Users);
        res.cookie('palugada-auth-token', token)
        res.redirect('/auth/google/success')
    },
)

googleAuthRouter.get('/google/failed', (req: Request, res: Response) => res.send('Google authentication failed'))
googleAuthRouter.get('/google/success',
    requireJwtAuth,
    (req: Request, res: Response) => {
        console.log(req.headers.cookie)
        res.send('Google authentication successful')
    })

export { googleAuthRouter };