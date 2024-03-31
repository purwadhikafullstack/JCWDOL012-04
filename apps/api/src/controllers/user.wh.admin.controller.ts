import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { resInternalServerError, resSuccess, resUnprocessable } from '@/services/responses';
import { generateHashedPassword } from '@/services/auth/auth';

const prisma = new PrismaClient();

export async function getAdmins(req: Request, res: Response) {
    try {
        const admins = await prisma.users.findMany({
            where: {
                role: 'WAREHOUSE_ADMIN',
                archived: false
            }
        })
        resSuccess(res, 'Administrator data retrieved successfully', admins, 1)
    } catch (error) {
        console.error('Error getting admin data', error)
        resInternalServerError(res, 'Error getting admin data', null)
    }
}

export async function getIdleAdmins(req: Request, res: Response) {
    try {
        const admins = await prisma.users.findMany({
            where: {
                role: 'WAREHOUSE_ADMIN',
                archived: false,
                wareHouseAdmin_warehouseId: null
            }
        })
        resSuccess(res, 'Administrator data retrieved successfully', admins, 1)
    } catch (error) {
        console.error('Error getting admin data', error)
        resInternalServerError(res, 'Error getting admin data', null)
    }
}

export async function createWarehouseAdmin(req: Request, res: Response) {
    try {
        const { email, password, firstName, lastName, gender } = req.body;
        if (!email || !password || !firstName || !lastName || !gender) return resUnprocessable(res, 'Missing mandatory fields', null)
        const hashedPassword = await generateHashedPassword(password)

        const isUserExisted = await prisma.users.findUnique({
            where: {
                email
            }
        })

        const admin = isUserExisted
            ? await prisma.users.update({
                where: {
                    id: isUserExisted.id
                },
                data: {
                    password: hashedPassword,
                    firstName,
                    lastName,
                    gender,
                    isVerified: true,
                    role: "WAREHOUSE_ADMIN",
                    archived: false
                }
            })
            : await prisma.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    gender,
                    isVerified: true,
                    role: 'WAREHOUSE_ADMIN'
                }
            })

        resSuccess(res, 'Warehouse Admin created successfully', admin, 1)
    } catch (error) {
        console.error('Error creating warehouse admin', error)
        resInternalServerError(res, 'Error creating warehouse admin', null)
    }
}

export async function getWarehouseAdminData(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return resUnprocessable(res, 'Missing mandatory fields: id', null)
        const admin = await prisma.users.findUnique({
            where: {
                id: parseInt(id),
                archived: false
            }
        })
        resSuccess(res, 'Warehouse Admin data retrieved successfully', admin, 1)
    } catch (error) {
        console.error('Error getting warehouse admin data', error)
        resInternalServerError(res, 'Error getting warehouse admin data', null)
    }
}

export async function archiveWarehouseAdmin(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return resUnprocessable(res, 'Missing mandatory fields: id', null)
        const admin = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: {
                archived: true,
                wareHouseAdmin_warehouseId: null
            }
        })
        resSuccess(res, 'Warehouse Admin archieved successfully', admin, 1)
    } catch (error) {
        console.error('Error archieving warehouse admin', error)
        resInternalServerError(res, 'Error archieving warehouse admin', null)
    }
}

export async function updateWarehouseAdmin(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return resUnprocessable(res, 'Missing mandatory fields: id', null)

        const { email, password, firstName, lastName, gender } = req.body;
        if (!email && !firstName && !lastName && !gender) return resUnprocessable(res, 'Missing mandatory fields.', null)

        const hashedPassword = password
            ? await generateHashedPassword(password)
            : null

        const data = hashedPassword
            ? { email, firstName, gender, lastName, password: hashedPassword }
            : { email, firstName, lastName, gender }

        const admin = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: data
        })

        resSuccess(res, 'Warehouse Admin updated successfully', admin, 1)
    }
    catch (error) {
        console.error('Error updating warehouse admin', error)
        resInternalServerError(res, 'Error updating warehouse admin', null)
    }
}