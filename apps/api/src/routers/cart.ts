import express, { Request, Response, Router, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { simulateAuthencticateToken } from "@/feature3Lib/simulateLoginUser1";

const prisma = new PrismaClient();
const cartRouter = Router();


cartRouter.get('/cart', simulateAuthencticateToken, async (req:Request, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    const cart = await prisma.cart.findMany({
        where: {
            userId: user.id
        }
    });
});