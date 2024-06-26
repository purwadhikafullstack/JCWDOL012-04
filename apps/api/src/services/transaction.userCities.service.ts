import { prisma } from "./prisma.service";
import { UserCities, Users } from "@prisma/client";

export default class UserCitiesTransactionService {

    async getByUserId(userId: number): Promise<UserCities[]> {
        const user = await prisma.userCities.findMany({
            where: {
                userId: userId
            }
        });
        return user ?? [];
    }

    async getUsersByUserId(userId: number): Promise<Users> {
        const user:Users = await prisma.users.findUnique({
            where: {
                id: userId
            },
            include: {
                userCities: true
            }
        }) as Users;
        return user;
    }

    async getById(id: number): Promise<UserCities | null> {
        return await prisma.userCities.findUnique({
            where: {
                id: id
            }
        });
    }

    async updateClosestWarehouseId(id: number, closestWarehouseId: number): Promise<UserCities> {
        return await prisma.userCities.update({
            where: {
                id: id
            },
            data: {
                closestWarehouseId: closestWarehouseId
            }
        });
    }

}