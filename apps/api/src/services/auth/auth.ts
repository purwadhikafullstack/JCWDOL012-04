
import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { resBadRequest, resCreated, resInternalServerError, resUnauthorized, resUnprocessable } from "../responses";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../email/templates";
import { genSalt, hash } from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
const prisma = new PrismaClient();

export function generateJWT(user: Users, info?: string | { [key: string]: any }) {
    const token = jwt.sign(
        {
            expiresIn: "1d",
            id: user.id,
            email: user.email,
            info: info,
            googleId: user?.googleId
        },
        secretKey!
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
        if (existingUser?.email && existingUser?.isVerified) return resUnprocessable(res, 'Email is in use', null, 0)
        if (existingUser?.email && !existingUser?.isVerified) return resUnauthorized(res, 'Email is not verified', null, -1)
        const { email, firstName, lastName } = req.body;
        const newUser = await registerUnverifiedUser({ email, firstName, lastName })
        return resCreated(res, 'User registered successfully', newUser!)

    } catch (error) {
        console.log(error)
        return next(error)
    }
}

async function registerUnverifiedUser({ email, firstName, lastName }: Request['body']) {
    try {
        const newUnverifiedUser = await prisma.users.create({
            data: {
                email,
                firstName,
                lastName,
            }
        })
        const token = generateJWT(newUnverifiedUser)
        await sendVerificationEmail(newUnverifiedUser.email, token)
        return newUnverifiedUser
    } catch (error) {
        throw error
    }
}