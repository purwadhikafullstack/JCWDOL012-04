import { prisma } from "./prisma.service";
import { Mutations, mutationType } from "@prisma/client";
import { MutationCreateModel } from "@/model/transaction.mutation.create.model";

export default class TransactionMutationService {
    async create(mutationOrder: Mutations): Promise<Mutations> {
        return await prisma.mutations.create({
            data: mutationOrder
        });
    }

    async createShipment(mutationOrder: MutationCreateModel[]): Promise<boolean> {
        try {
            await prisma.$transaction(async (prisma) => {
                for (const mutation of mutationOrder) {
                    await prisma.mutations.create({
                        data: mutation
                    });
                }
            });
            return true;
        } catch (error) {
            console.error("Create Shipment failed: ", error);
            return false;
        }

     
    }

    async getByProductId(productId: number): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                productId: productId
            }
        });
    }

    async getByWarehouseId(warehouseId: number): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                warehouseId: warehouseId
            }
        });
    }

    async getByTransactionId(transactionId: number): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                transactionId: transactionId
            },
            include: {
                transaction: true
            }
        });
    }

    async getByMutationType(mutationType: mutationType): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                mutationType: mutationType
            }
        });
    }

    async getByIsAdd(isAdd: boolean): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                isAdd: isAdd
            }
        });
    }

    async getByIds(ids: number[]): Promise<Mutations[]> {
        return await prisma.mutations.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    }

    async getById(id: number): Promise<Mutations | null> {
        return await prisma.mutations.findUnique({
            where: {
                id: id
            }
        });
    }

    async update(id: number, mutationOrder: Mutations): Promise<Mutations> {
        return await prisma.mutations.update({
            where: {
                id: id
            },
            data: mutationOrder
        });
    }
}