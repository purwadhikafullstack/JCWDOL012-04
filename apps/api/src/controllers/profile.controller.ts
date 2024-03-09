import { NextFunction, Request, Response } from "express";
import { PrismaClient, Users } from "@prisma/client";
import bcrypt from "bcrypt";
import { resInternalServerError, resSuccess, resUnprocessable } from "@/services/responses";

const prisma = new PrismaClient();

export async function changeName(req: Request, res: Response) {
    if (!req.body.password) resUnprocessable(res, 'Password is required', null)

    const { firstName, lastName, password } = req.body;
    const user = req.user as Users;
    const passwordMatch = await bcrypt.compare(password, user.password ? user.password : '');
    if (!passwordMatch) resUnprocessable(res, 'Password is incorrect', null)

    if (passwordMatch) {
        try {
            const updatedUser = await prisma.users.update({
                where: { id: user.id },
                data: {
                    firstName,
                    lastName
                }
            })
            resSuccess(res, 'Name updated successfully', updatedUser, 1)
        } catch (error) {
            console.log('Error', error)
            resInternalServerError(res, 'Error updating name', null)
        }
    }
}

export async function validatePassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body.newPassword || !req.body.currentPassword) resUnprocessable(res, 'New and current password are required. One of them is missing in the request.', null)

    const { currentPassword, newPassword } = req.body;
    const user = req.user as Users;

    const passwordMatch = await bcrypt.compare(currentPassword, user.password ? user.password : '');
    if (!passwordMatch) return resUnprocessable(res, 'Current password is incorrect', null)

    if (passwordMatch && newPassword) return req.body.password = newPassword;

    next();
}