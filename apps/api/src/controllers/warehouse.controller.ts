import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resInternalServerError, resSuccess } from "@/services/responses";

const prisma = new PrismaClient();

export default async function getWarehouses(req: Request, res: Response) {

    await prisma.warehouses.findMany({
        where: {
            archived: false,
        },
        select: {
            id: true,
            name: true,
            address: true,
            city: {
                select: {
                    name: true,
                    type: true
                }
            },
            warehouseAdmin: {
                select: {
                    firstName: true,
                }
            }
        }
    })
        .then((warehouses) => resSuccess(res, 'Get all warehouses', warehouses))
        .catch((error) => {
            console.error(error);
            resInternalServerError(res, "Error getting warehouses", null)
        });
}

export async function createWarehouse(req: Request, res: Response) {
    console.log(req.body)
    const { name, address, cityId, latitude, longitude, adminId } = req.body
    try {
        const trx = await prisma.$transaction(async (tx) => {
            const newWarehouse = await tx.warehouses.create({
                data: {
                    name,
                    address,
                    cityId: parseInt(cityId),
                    latitude,
                    longitude,
                }
            });

            const updateUser = adminId
                ? await tx.users.update({
                    where: {
                        id: parseInt(adminId)
                    },
                    data: {
                        wareHouseAdmin_warehouseId: newWarehouse.id,
                    }
                })
                : Promise.resolve();

            return { newWarehouse, updateUser }
        })

        return resSuccess(res, 'Warehouse created', trx.newWarehouse)

    } catch (error) {
        console.error(error)
        resInternalServerError(res, 'Error creating warehouse', null)
    }
}

export async function updateWarehouse(req: Request, res: Response) {
    const { id, name, address, cityId, latitude, longitude, adminId } = req.body

    try {
        const trx = await prisma.$transaction(async (updateWH) => {
            const initialWarehouseData = await prisma.warehouses.findUnique({
                where: { id },
                select: {
                    warehouseAdmin: {
                        select: {
                            id: true,
                            wareHouseAdmin_warehouseId: true
                        }
                    }
                }
            })

            const updatedWarehouse = await prisma.warehouses.update({
                where: { id },
                data: {
                    name,
                    address,
                    cityId,
                    latitude,
                    longitude,
                }
            })

            const updatedAdmin = adminId !== initialWarehouseData?.warehouseAdmin[0].id
                ? await prisma.users.update({
                    where: {
                        id: adminId ? adminId : initialWarehouseData?.warehouseAdmin[0].id
                    },
                    data: {
                        wareHouseAdmin_warehouseId: adminId ? id : null
                    }
                })
                : Promise.resolve();

            return { updatedWarehouse, updatedAdmin }
        })
        return resSuccess(res, 'Warehouse updated', trx.updatedWarehouse)
    } catch (error) {
        console.error(error)
        resInternalServerError(res, 'Error updating warehouse', null)
    }
}