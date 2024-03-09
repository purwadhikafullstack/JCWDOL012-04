import { prisma } from "./prisma.service";
import { Transactions } from "@prisma/client";


export default class TransactionService {
    async create(transaction: Transactions): Promise<Transactions> {
        return await prisma.transactions.create({
            data: transaction
        });
    }

    async getByUserId(userId: number): Promise<Transactions[]> {
        return await prisma.transactions.findMany({
            where: {
                userId: userId
            }, 
            include: {
                products: true,
                mutations: true
            }
        });
    }

    async getById(id: number): Promise<Transactions | null> {
        return await prisma.transactions.findUnique({
            where: {
                id: id
            },
            include: {
                products: true,
                mutations: true
            }
        });
    }

    async update(id: number, transaction: Transactions): Promise<Transactions> {
        return await prisma.transactions.update({
            where: {
                id: id
            },
            data: transaction
        });
    }
}