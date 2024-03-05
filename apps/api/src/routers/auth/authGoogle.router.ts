import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { generateJWT } from "@/services/auth/auth";
import { Users } from "@prisma/client";
import { Router } from "express";
import { Request, Response } from "express";
import passport from "passport";

const googleAuthRouter = Router();
const isProduction = process.env.NODE_ENV === 'production';
const WEB_BASE_URL = isProduction ? process.env.WEB_CLIENT_BASE_URL_PROD : process.env.WEB_CLIENT_BASE_URL_DEV;

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
        res.cookie('palugada-auth-token', token, { maxAge: 1000 * 60 * 60 * 24 })
        res.redirect('/auth/google/success')
    },
)

googleAuthRouter.get('/google/failed', (req: Request, res: Response) => res.send('Google authentication failed'))
googleAuthRouter.get('/google/success',
    (req: Request, res: Response) => {
        res.redirect(WEB_BASE_URL!)
    })

export { googleAuthRouter };