import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { resInternalServerError, resSuccess, resUnprocessable } from "@/services/responses";

const prisma = new PrismaClient();

export async function getWarehouses(req: Request, res: Response) {

    await prisma.warehouses.findMany({
        where: {
            archived: false,
        },
        select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            city: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    provinceId: true
                }
            },
            warehouseAdmin: {
                select: {
                    id: true,
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

export async function getWarehouse(req: Request, res: Response) {
    const { id } = req.params
    if (!id) return resUnprocessable(res, 'Missing mandatory field: warehouseId', null)

    await prisma.warehouses.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            city: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    provinceId: true
                }
            },
            warehouseAdmin: {
                select: {
                    id: true,
                    firstName: true,
                }
            }
        }
    })
        .then((warehouse) => resSuccess(res, 'Get warehouse success', warehouse))
        .catch((error) => {
            console.error(error)
            resInternalServerError(res, 'Error getting warehouse', null)
        })
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
    const { name, address, cityId, latitude, longitude, adminId } = req.body
    const { id } = req.params
    if (!id) return resUnprocessable(res, 'Missing mandatory field: warehouseId', null)

    try {
        const trx = await prisma.$transaction(async (tx) => {
            const initialWarehouseData = await tx.warehouses.findUnique({
                where: { id: parseInt(id) },
                select: {
                    warehouseAdmin: {
                        select: {
                            id: true,
                            wareHouseAdmin_warehouseId: true
                        }
                    }
                }
            })

            const updatedWarehouse = await tx.warehouses.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    address,
                    cityId: parseInt(cityId),
                    latitude,
                    longitude,
                }
            })

            if (adminId === '') {
                await tx.users.update({
                    where: {
                        id: initialWarehouseData?.warehouseAdmin[0].id
                    },
                    data: {
                        wareHouseAdmin_warehouseId: null
                    }
                })
            }

            if (adminId !== '' && adminId != initialWarehouseData?.warehouseAdmin[0]?.id) {
                // Update the new admin
                await tx.users.update({
                    where: {
                        id: adminId ? parseInt(adminId) : initialWarehouseData?.warehouseAdmin[0].id
                    },
                    data: {
                        wareHouseAdmin_warehouseId: adminId ? parseInt(id) : null
                    }
                })

                //update the old admin
                if (initialWarehouseData?.warehouseAdmin[0]?.id) {
                    await tx.users.update({
                        where: {
                            id: initialWarehouseData?.warehouseAdmin[0]?.id
                        },
                        data: {
                            wareHouseAdmin_warehouseId: null
                        }
                    })
                }
            }

            return updatedWarehouse
        })
        return resSuccess(res, 'Warehouse updated', trx)
    } catch (error) {
        console.error(error)
        resInternalServerError(res, 'Error updating warehouse', null)
    }
}

export async function archiveWarehouse(req: Request, res: Response) {
    try {
        const { id } = req.params
        if (!id) return resUnprocessable(res, 'Missing mandatory field: warehouseId', null)

        const trx = await prisma.$transaction(async (tx) => {
            const initialWarehouseData = await tx.warehouses.findUnique({
                where: { id: parseInt(id) },
                select: {
                    warehouseAdmin: {
                        select: {
                            id: true,
                            wareHouseAdmin_warehouseId: true
                        }
                    }
                }
            })

            const archivedWH = await tx.warehouses.update({
                where: { id: parseInt(id) },
                data: {
                    archived: true
                }
            })

            const updatedAdmin = initialWarehouseData?.warehouseAdmin.length
                ? await tx.users.update({
                    where: {
                        id: initialWarehouseData?.warehouseAdmin[0].id
                    },
                    data: {
                        wareHouseAdmin_warehouseId: null
                    }
                })
                : Promise.resolve();

            return { archivedWH, updatedAdmin }
        })
        return resSuccess(res, 'Warehouse archived', trx.archivedWH)
    } catch (error) {
        console.error(error)
        resInternalServerError(res, 'Error archiving warehouse', null)
    }
}