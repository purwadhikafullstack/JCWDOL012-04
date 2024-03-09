import passport from "passport";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JwtStrategy = require("passport-jwt").Strategy;

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

function tokenExtractor(req: any) {
    console.log(req.query.token)
    if (req.query.token) return req.query.token;
    if (req.headers.cookie) return req.cookies['palugada-auth-token'];
    return null;
}

const jwtLogin = new JwtStrategy(
    {
        jwtFromRequest: tokenExtractor,
        secretOrKey: secretKey!
    },
    async (payload: any, done: any) => {

        try {
            const user = await prisma.users.findUnique({ where: { id: payload.id } });
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (error) {
            console.error(error);
            done(error, false);
        }
    })

passport.use(jwtLogin);