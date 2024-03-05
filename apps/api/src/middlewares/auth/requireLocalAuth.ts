import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";

export default function requireLocalAuth(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: Error, user: Users, info: string) => {
        if (err) return next(err);
        if (!user) return res.status(422).send(info);
        req.user = user;
        next()
    })(req, res, next)
}