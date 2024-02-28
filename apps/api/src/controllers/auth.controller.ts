import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { compare } from 'bcrypt'
import { Secret, sign } from 'jsonwebtoken'
import { resBadRequest, resCreated, resInternalServerError, resSuccess, resUnauthorized } from "@/services/responses";
import { createNewUser } from "@/services/auth";

const prisma = new PrismaClient();

export async function registerWithEmail(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) return resBadRequest(res, 'Email and password are required', null)
    if (!req.body.firstName || !req.body.lastName) return resBadRequest(res, 'First name and last name are required', null)
    if (!req.body.gender) return resBadRequest(res, "Gender is required", null)
    if (!req.body.phoneNumber) return resBadRequest(res, "Phone number is required", null)

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
    if (!req.body.email || !req.body.password) return resBadRequest(res, 'Email and password are required', null)

    try {
        const { email, password } = req.body
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) return resBadRequest(res, 'Invalid email or password', null)
        if (!user.password) return resUnauthorized(res, 'User ', null, 0) //Tambah provider (Google) -> !user.provider

        const passwordMatch = await compare(password, user.password)
        if (!passwordMatch) return resBadRequest(res, 'Invalid email or password', null)

        const secret = process.env.JWT_SECRET as Secret
        const token = sign({ id: user.id }, secret, { expiresIn: '1d' })

        return resSuccess(res, 'Login successful', { user, token })

    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'Login failed', null)
    }
}