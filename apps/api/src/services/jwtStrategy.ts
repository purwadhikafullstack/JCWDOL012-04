import passport from "passport";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

function cookieExtractor(req: any) {
    let token = null;
    if (req.headers.cookie) {
        token = req.cookies['palugada-auth-token'];
    }
    return token;
}

const jwtLogin = new JwtStrategy(
    {
        jwtFromRequest: cookieExtractor,
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