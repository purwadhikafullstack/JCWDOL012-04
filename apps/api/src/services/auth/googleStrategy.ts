import passport, { Profile } from "passport";
import { PrismaClient } from "@prisma/client";

type GoogleAuthResponse = {
    provider: 'google',
    sub: string,
    id: string,
    displayName: string,
    name: { familyName: string, givenName: string },
    given_name: string,
    family_name: string,
    email_verified: boolean,
    verified: boolean,
    language: string,
    email: string,
    emails: [{ value: string, type: string }],
    photos: [{ value: string, type: string }],
    picture: string,
}

const serverURL = process.env.NODE_ENV === "production" ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
if (!GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not defined')
if (!GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not defined')
if (!GOOGLE_CALLBACK_URL) throw new Error('GOOGLE_CALLBACK_URL is not defined')
if (!serverURL) throw new Error('SERVER_URL is not defined')

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const prisma = new PrismaClient();

const googleLogin = new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${serverURL}${GOOGLE_CALLBACK_URL}`,
        proxy: true
    },
    async (accessToken: any, refreshToken: any, profile: GoogleAuthResponse, done: any) => {
        try {
            const oldUser = await prisma.users.findUnique({ where: { email: profile.email } });
            if (oldUser && !oldUser.googleId) {
                const updatedUser = await prisma.users.update({
                    where: {
                        id: oldUser.id
                    },
                    data: {
                        googleId: profile.id,
                        isVerified: true
                    }
                });
                return done(null, updatedUser);
            }
            if (oldUser) return done(null, oldUser);
        } catch (error) {
            console.error(error);
            done(error, null);
        }

        try {
            const newUser = await prisma.users.create({
                data: {
                    email: profile.email,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    isVerified: profile.email_verified
                }
            });

            done(null, newUser);

        } catch (error) {
            console.error(error)
            done(error, null);
        }
    }
)

passport.use(googleLogin);