import { Request, Response } from 'express';
import { PrismaClient, Users } from '@prisma/client';
import { resInternalServerError, resSuccess, resUnprocessable } from '@/services/responses';
import { genSalt, hash } from 'bcrypt';

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
        console.log('Error getting user addresses', error)
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
        console.log('Error adding user address', error);
        resInternalServerError(res, 'Error adding user address', null);
    }
}

export async function archieveAddress(req: Request, res: Response) {
    const user = req.user as Users;
    const { id } = req.params;
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
    const { isPrimaryAddress, cityId, address, latitude, longitude, label, archieved } = req.body;
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

export async function createWarehouseAdmin(req: Request, res: Response) {
    try {
        const { email, password, firstName, lastName, gender } = req.body;
        if (!email || !password || !firstName || !lastName || !gender) return resUnprocessable(res, 'Missing mandatory fields', null)
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        const admin = await prisma.users.create({
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

export async function archieveWarehouseAdmin(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return resUnprocessable(res, 'Missing mandatory fields: id', null)
        const admin = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: {
                archived: true
            }
        })
        resSuccess(res, 'Warehouse Admin archieved successfully', admin, 1)
    } catch (error) {
        console.error('Error archieving warehouse admin', error)
        resInternalServerError(res, 'Error archieving warehouse admin', null)
    }
}