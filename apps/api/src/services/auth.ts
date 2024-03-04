
import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { resBadRequest, resCreated, resInternalServerError } from "./responses";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";
const secretKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
const prisma = new PrismaClient();

export function generateJWT(user: Users) {
    const token = jwt.sign(
        {
            expiresIn: "1d",
            id: user.id,
            email: user.email,
            googleId: user?.googleId
        },
        secretKey!
    );
    return token;
}

export async function registerNewUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email || !req.body.password) return resBadRequest(res, 'Email and password are required', null)
    if (!req.body.firstName || !req.body.lastName) return resBadRequest(res, 'First name and last name are required', null)

    try {
        const existingUser = await prisma.users.findUnique({ where: { email: req.body.email } })
        if (existingUser) return res.status(422).send('Email is in use')
        const { email, password, firstName, lastName } = req.body;
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        const newUser = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                isVerified: false,
            }
        })
        return resCreated(res, 'User registered successfully', newUser)

    } catch (error) {
        console.log(error)
        return next(error)
    }
}