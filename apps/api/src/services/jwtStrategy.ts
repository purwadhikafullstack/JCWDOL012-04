import passport from "passport";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
// import { ExtractJwt } from "passport-jwt";
const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

const jwtLogin = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
        secretOrKey: secretKey!
    },
    async (payload: any, done: any) => {
        console.log("HEREERERER")
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