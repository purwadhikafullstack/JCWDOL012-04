import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { compare } from 'bcrypt'
import { Secret, sign, verify } from 'jsonwebtoken'
import { resBadRequest, resCreated, resForbidden, resInternalServerError, resSuccess, resUnauthorized } from "@/services/responses";
import { createNewUser } from "@/services/auth";

const prisma = new PrismaClient();
type DecryptedUserToken = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
};
declare module 'express' {
    export interface Request {
        user?: DecryptedUserToken | null
    }
}

export async function registerWithEmail(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) return resBadRequest(res, 'Email and password are required', null)
    if (!req.body.firstName || !req.body.lastName) return resBadRequest(res, 'First name and last name are required', null)
    if (!req.body.gender) return resBadRequest(res, "Gender is required", null)
    if (!req.body.phoneNumber) return resBadRequest(res, "Phone number is required", null)
    if (req.user!) return resForbidden(res, 'User already logged in', null, 1)

    try {
        const { email } = req.body
        const existingUser = await prisma.users.findUnique({ where: { email } })
        if (existingUser) return resBadRequest(res, 'Email already registered with another account', null, -1)

        const newUser = await createNewUser(req.body)

        return resCreated(res, 'User registered successfully', newUser)

    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'User registration failed', null)
    }
}

export async function loginWithEmail(req: Request, res: Response) {
    if (req.user) return resSuccess(res, 'User already logged in', null, 1)
    if (!req.body.email || !req.body.password) return resBadRequest(res, 'Email and password are required', null)

    try {
        const { password } = req.body
        const user = await prisma.users.findUnique({ where: { email: req.body.email } })
        if (!user) return resBadRequest(res, 'Invalid email or password', null)
        if (!user.password) return resUnauthorized(res, 'User ', null, 0) //Tambah provider (Google) -> !user.provider

        const passwordMatch = await compare(password, user.password)
        if (!passwordMatch) return resBadRequest(res, 'Invalid email or password', null)

        const secret = process.env.JWT_SECRET as Secret
        const { id, firstName, lastName, email, role } = user
        const token = sign({ id, firstName, lastName, email, role }, secret, { expiresIn: '1d' })

        return resSuccess(res, 'Login successful', { user, token })

    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'Login failed', null)
    }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            req.user = null
            return next()
        }
        const verified = verify(token, process.env.JWT_SECRET as Secret)
        if (!verified) return resUnauthorized(res, 'Invalid or expired token', null)
        req.user = verified as DecryptedUserToken
        next()
    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'Token verification failed', null)
    }
}