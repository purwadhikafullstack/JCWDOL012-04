import { prisma } from "./prisma.service";
import { ProductCategories, TransactionsProducts, Products } from "@prisma/client";

export default class TransactionProductService {
    async create(transactionProduct: any): Promise<TransactionsProducts> {
        return await prisma.transactionsProducts.create({
            data: transactionProduct
        });
    }

    async createProductWarehouse(productId: number, warehouseId: number): Promise<any> {
        return await prisma.productsWarehouses.create({
            data: {
                productId: productId,
                warehouseId: warehouseId,
                stock: 0
            }
        });
    }

    async getGlobalStockbyProductId(productId: number): Promise<any> {
        return await prisma.productsWarehouses.aggregate({
            _sum: {
                stock: true
            },
            where: {
                productId: productId,
                archived:false
            },
        });
    }

    async getProductWarehouseByProductId(ProductId: number, warehouseId:number): Promise<any> {
        return await prisma.productsWarehouses.findFirst({
            where: {
                productId: ProductId,
                warehouseId: warehouseId,
                archived: false
            }
        });
    }

    async getProductById(productId: number): Promise<Products | null> {
        return await prisma.products.findUnique({
            where: {
                id: productId,
                archived: false
            },
            include: {
                productImages: {
                    where: {
                      archived: false,
                    },
                  }
            }
        });
    }

    async getAllProductCategory(): Promise<ProductCategories[]> {
        return await prisma.productCategories.findMany();
    }

    async getByTransactionId(transactionId: number): Promise<TransactionsProducts[]> {
        return await prisma.transactionsProducts.findMany({
            where: {
                transactionId: transactionId
            }
        });
    }

    async getById(id: number): Promise<TransactionsProducts | null> {
        return await prisma.transactionsProducts.findUnique({
            where: {
                id: id
            }
        });
    }

    async update(id: number, transactionProduct: TransactionsProducts): Promise<TransactionsProducts> {
        return await prisma.transactionsProducts.update({
            where: {
                id: id
            },
            data: transactionProduct
        });
    }
}