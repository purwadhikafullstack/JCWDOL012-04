import { resUnauthorized } from "@/services/responses";
import { Users } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function unverifiedUserGuard(req: Request, res: Response, next: NextFunction) {
    const { isVerified } = req.user as Users
    if (req.user && isVerified) {
        return resUnauthorized(res, 'Your account is verified already.', null)
    }
    next();
}

export function superAdminGuard(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user as Users
    if (req.user && role !== 'SUPER_ADMIN') {
        return resUnauthorized(res, 'You are not authorized to perform this action.', null)
    }
    next();
}

export function warehouseAdminGuard(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user as Users
    if (req.user && role !== 'WAREHOUSE_ADMIN') {
        return resUnauthorized(res, 'You are not authorized to perform this action.', null)
    }
    next();
}

export function customerGuard(req: Request, res: Response, next: NextFunction) {
    const { role } = req.user as Users
    if (req.user && role !== 'CUSTOMER') {
        return resUnauthorized(res, 'You are not authorized to perform this action.', null)
    }
    next();
}