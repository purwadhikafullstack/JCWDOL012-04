import { Request, Response } from 'express';
import { PrismaClient, Users } from '@prisma/client';
import { resInternalServerError, resSuccess, resUnprocessable } from '@/services/responses';
const prisma = new PrismaClient();

export async function getUserAddresses(req: Request, res: Response) {
    const user = req.user as Users;
    try {
        const addresses = await prisma.userCities.findMany({
            where: {
                userId: user.id,
                archieved: false
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
        console.error('Error getting user addresses', error)
        resInternalServerError(res, 'Error getting user addresses', null)
    }
}

export async function addAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { isPrimaryAddress, cityId, address, latitude, longitude, label, archieved } = req.body;
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
                        archieved,
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
                    archieved,
                },
            });
            resSuccess(res, 'Address added successfully', newAddress, 1);
        };
    } catch (error) {
        console.error('Error adding user address', error);
        resInternalServerError(res, 'Error adding user address', null);
    }
}

export async function archieveAddress(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return resUnprocessable(res, "Missing fields: address id", null)
    try {
        const archievedAddress = await prisma.userCities.update({
            where: {
                id: parseInt(id)
            },
            data: {
                archieved: true
            }
        });
        resSuccess(res, 'Address archieved successfully', archievedAddress, 1);
    } catch (error) {
        console.error('Error archieving user address', error);
        resInternalServerError(res, 'Error archieving user address', null);
    }
}

export async function setAsPrimaryAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { id } = req.params;
    if (!id) return resUnprocessable(res, "Missing field: Address Id", null)
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
        console.error('Error setting user address as primary', error);
        resInternalServerError(res, 'Error setting user address as primary', null);
    }
}

export async function updateAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { isPrimaryAddress, cityId, address, latitude, longitude, label, archieved } = req.body;
    const { id } = req.params;
    if (!id) return resUnprocessable(res, "Missing field: Address Id", null)

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
                        archieved,
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
                    archieved,
                    isPrimaryAddress,
                    cityId: parseInt(cityId)
                }
            });
            resSuccess(res, 'Address updated successfully', updatedAddress, 1);
        }
    } catch (error) {
        console.error('Error updating user address', error);
        resInternalServerError(res, 'Error updating user address', null);
    }

}