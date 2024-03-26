
import { Users } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { resBadRequest, resCreated, resUnauthorized, resUnprocessable } from "../responses";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../email/templates";
import { genSalt, hash } from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
if (!secretKey) throw new Error('JWT_SECRET is not defined')

const prisma = new PrismaClient();

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

export async function registerNewUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email) return resBadRequest(res, 'Email is required', null)
    if (!req.body.firstName || !req.body.lastName) return resBadRequest(res, 'First name and last name are required', null)

    try {
        const existingUser = await prisma.users.findUnique({ where: { email: req.body.email } })
        if (existingUser?.email && existingUser?.isVerified && existingUser.password) return resUnprocessable(res, 'Email is in use', null, 0)
        if (existingUser?.email && !existingUser?.isVerified) return resUnauthorized(res, 'Email is not verified', null, -1)
        const { email, firstName, lastName } = req.body;

        const newUser = existingUser?.email === email
            ? await prisma.users.update({
                where: {
                    email
                },
                data: {
                    firstName,
                    lastName,
                }
            })
            : await prisma.users.create({
                data: {
                    email,
                    firstName,
                    lastName,
                }
            })
        if (!newUser) return resUnprocessable(res, 'Unexpected Error when creating user', null, -1)

        await sendVerificationEmail(newUser.email, generateJWT(newUser, null, "1h"))
        return resCreated(res, 'User registered successfully', newUser)

    } catch (error) {
        console.error(error)
        return next(error)
    }
}