
import { Users } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { genSalt, hash } from "bcrypt";
require('dotenv').config();

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
if (!secretKey) throw new Error('JWT_SECRET is not defined')

export function generateJWT(user: Users, info?: string | { [key: string]: any } | null, expiresIn?: SignOptions['expiresIn']) {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            info: info,
            googleId: user?.googleId
        },
        secretKey!,
        {
            expiresIn: expiresIn || "1d"
        }
    );
    return token;
}

export async function generateHashedPassword(password: string): Promise<string> {
    try {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password', error);
        throw error;
    }
}