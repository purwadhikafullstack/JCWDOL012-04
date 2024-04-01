import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { resInternalServerError, resSuccess } from '@/services/responses';
const prisma = new PrismaClient();

export function getCustomers(req: Request, res: Response) {
    prisma.users.findMany({
        where: {
            role: 'CUSTOMER',
            archived: false
        }
    })
        .then((customers) => resSuccess(res, 'Customer data retrieved successfully', customers, 1))
        .catch((error) => {
            console.error('Error getting customer data', error)
            resInternalServerError(res, 'Error getting customer data', null)
        })
}