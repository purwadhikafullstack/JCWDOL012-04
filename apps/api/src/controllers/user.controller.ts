import { Request, Response } from 'express';
import { PrismaClient, Users } from '@prisma/client';
import { resInternalServerError, resSuccess } from '@/services/responses';

const prisma = new PrismaClient();

export async function getUserAddresses(req: Request, res: Response) {
    const user = req.user as Users;
    try {
        const addresses = await prisma.userCities.findMany({
            where: {
                userId: user.id,
                archived: false
            },
            orderBy: [
                { isPrimaryAddress: 'desc' },
                { label: 'asc' }
            ],
            include: {
                city: true
            }
        });
        resSuccess(res, 'User addresses retrieved successfully', addresses, 1)
    } catch (error) {
        console.log('Error getting user addresses', error)
        resInternalServerError(res, 'Error getting user addresses', null)
    }
}

export async function addAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { isPrimaryAddress, cityId, address, latitude, longitude, label, archived } = req.body;
    try {
        if (isPrimaryAddress) {
            const newAddress = await prisma.$transaction([
                prisma.userCities.updateMany({
                    where: {
                        userId: user.id
                    },
                    data: {
                        isPrimaryAddress: false
                    }
                }),
                prisma.userCities.create({
                    data: {
                        userId: user.id,
                        cityId: parseInt(cityId),
                        address,
                        latitude,
                        longitude,
                        label,
                        archived,
                        isPrimaryAddress
                    }
                })
            ])
            resSuccess(res, 'Address added successfully', newAddress, 1);
        } else {
            const newAddress = await prisma.userCities.create({
                data: {
                    userId: user.id,
                    cityId: parseInt(cityId),
                    address,
                    latitude,
                    longitude,
                    label,
                    archived,
                },
            });
            resSuccess(res, 'Address added successfully', newAddress, 1);
        };
    } catch (error) {
        console.log('Error adding user address', error);
        resInternalServerError(res, 'Error adding user address', null);
    }
}

export async function archieveAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { id } = req.params;
    try {
        const archivedAddress = await prisma.userCities.update({
            where: {
                id: parseInt(id)
            },
            data: {
                archived: true
            }
        });
        resSuccess(res, 'Address archived successfully', archivedAddress, 1);
    } catch (error) {
        console.log('Error archieving user address', error);
        resInternalServerError(res, 'Error archieving user address', null);
    }
}

export async function setAsPrimaryAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { id } = req.params;
    try {
        const updatedAddress = await prisma.$transaction([
            prisma.userCities.updateMany({
                where: {
                    userId: user.id
                },
                data: {
                    isPrimaryAddress: false
                }
            }),
            prisma.userCities.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    isPrimaryAddress: true
                }
            })
        ]);
        resSuccess(res, 'Address set as primary successfully', updatedAddress, 1);
    } catch (error) {
        console.log('Error setting user address as primary', error);
        resInternalServerError(res, 'Error setting user address as primary', null);
    }
}

export async function updateAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { isPrimaryAddress, cityId, address, latitude, longitude, label, archived } = req.body;
    const { id } = req.params;
    try {
        if (isPrimaryAddress) {
            const updatedAddress = await prisma.$transaction([
                prisma.userCities.updateMany({
                    where: { userId: user.id },
                    data: {
                        isPrimaryAddress: false
                    }
                }),
                prisma.userCities.update({
                    where: { id: parseInt(id) },
                    data: {
                        address,
                        latitude,
                        longitude,
                        label,
                        archived,
                        isPrimaryAddress,
                        cityId: parseInt(cityId)
                    }
                })
            ]);
            resSuccess(res, 'Address updated successfully', updatedAddress, 1);
        } else {
            const updatedAddress = await prisma.userCities.update({
                where: { id: parseInt(id) },
                data: {
                    address,
                    latitude,
                    longitude,
                    label,
                    archived,
                    cityId: parseInt(cityId)
                }
            });
            resSuccess(res, 'Address updated successfully', updatedAddress, 1);
        }
    } catch (error) {
        console.log('Error updating user address', error);
        resInternalServerError(res, 'Error updating user address', null);
    }

}

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