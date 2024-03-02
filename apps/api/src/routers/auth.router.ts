import { Router } from "express";
import { Request } from "express";
import { loginWithEmail, registerWithEmail, verifyToken } from "@/controllers/auth.controller";
import { resSuccess, resUnauthorized } from "@/services/responses";
const session = require('express-session');

const passport = require('passport');
const authRouter = Router();

// authRouter.use(passport.initialize());
// authRouter.use(passport.session());
authRouter.get('/', (req, res) => res.send('Auth router'))
authRouter.post('/register', verifyToken, registerWithEmail);
authRouter.post('/login', verifyToken, loginWithEmail);

authRouter.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));
authRouter.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));

authRouter.get('/google/success', (req: Request, res) => {
    console.log(req.user)
    if (!req.user) return resUnauthorized(res, 'Unauthorized', null)
    res.send('Google login success')
})
authRouter.get('/google/failure', (req: Request, res) => {
    console.log(req.user)
    if (req.user) return resSuccess(res, 'User already logged in', null, 1)
    res.send('Google login failed')
})
export { authRouter };