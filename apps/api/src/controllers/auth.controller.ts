import { resInternalServerError, resSuccess, resUnauthorized, resUnprocessable } from "@/services/responses";
import { Users } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { genSalt, hash } from "bcrypt";
import { generateJWT } from "@/services/auth/auth";
import { sendResetPasswordInstructions } from "@/services/email/templates";

const prisma = new PrismaClient();

export async function setPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const salt = await genSalt(10)
        const hashedPassword = await hash(req.body.newPassword ? req.body.newPassword : req.body.password, salt)
        const { id } = req.user as Users
        const user = await prisma.users.update({
            where: {
                id: id
            },
            data: {
                isVerified: true,
                password: hashedPassword
            }
        })
        resSuccess(res, 'Password set successfully', user, 1)
    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'Error setting password', null)
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email) resUnprocessable(res, 'Email is required', null)
    const { email } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (!user) return resUnprocessable(res, 'User with that email does not exist', null)
        if (!user.password) return resUnprocessable(res, "You haven't set up any password. Register an account with your email and set up your password.", null, -1)

        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                isRequestingChangePassword: true
            }
        })

        await sendResetPasswordInstructions(email, generateJWT(user, null, '1h'))

        resSuccess(res, 'Reset password instructions sent to the email', null, 1)
    } catch (error) {
        console.log(error)
        return resInternalServerError(res, 'Error resetting password', null)
    }
}

export async function verifyChangePasswordRequest(req: Request, res: Response, next: NextFunction) {
    const user = req.user as Users
    if (!user) return resUnprocessable(res, 'User does not exist.', null)
    if (!user?.isRequestingChangePassword) return resUnprocessable(res, 'Invalid Token: Token has been used to reset the password.', null)
    if (user.isRequestingChangePassword) return resSuccess(res, 'Request is valid', { id: user.id }, 1)

    console.log("Error: Undhandled error at verifyChangePasswordRequest")
    return resInternalServerError(res, 'Unknown error.', null)
}