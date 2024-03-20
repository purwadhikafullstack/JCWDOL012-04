import { prisma } from "./prisma.service";
import { Products } from "@prisma/client";

export default class ProductTransactionService {

    async getById(id: number): Promise<Products | null> {
        return await prisma.products.findUnique({
            where: {
                id: id
            }
        });
    }

    async update(id: number, product: Products): Promise<Products> {
        return await prisma.products.update({
            where: {
                id: id
            },
            data: product
        });
    }
}
