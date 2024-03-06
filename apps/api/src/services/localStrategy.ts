import { PrismaClient } from "@prisma/client";
import passport from "passport";
import bcrypt from "bcrypt";

const LocalStrategy = require("passport-local").Strategy;
const prisma = new PrismaClient();

const localLogin = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
    passReqToCallback: true
},
    async (req: any, email: string, password: string, done: any) => {
        console.log(req.body)
        try {
            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) return done(null, false, { message: "Invalid email or password" });
            if (!user.isVerified) return done(null, false, { message: "Please verify your email" });
            if (!user.password) return done(null, false, { message: "Credentials are not verified. Check your email and follow the instructions." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Invalid email or password" });
            return done(null, user);
        } catch (error) {
            console.error(error);
            done(error, false);
        }
    }
)

passport.use(localLogin);