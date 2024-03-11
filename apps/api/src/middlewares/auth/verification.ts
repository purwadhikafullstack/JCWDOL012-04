import { resInternalServerError, resSuccess, resUnauthorized } from "@/services/responses";
import { Users } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

export function unverifiedUserGuard(req: Request, res: Response, next: NextFunction) {
    const { isVerified } = req.user as Users
    if (req.user && isVerified) {
        return resUnauthorized(res, 'Your account is verified already.', null)
    }
    next();
}

export async function setPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const salt = await genSalt(10)
        const hashedPassword = await hash(req.body.password, salt)
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