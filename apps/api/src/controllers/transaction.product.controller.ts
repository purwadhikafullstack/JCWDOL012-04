import { Request, Response } from "express";
import { TransactionsProducts, ProductsWarehouses, Users } from "@prisma/client";
import TransactionProductService from "@/services/transaction.product.service";
import { prisma } from "@/services/prisma.service";

interface TransactionProductWithStockModel extends TransactionsProducts {
    stock: number;
    globalStock: number;
}

export default class TransactionProductController {
    prisma;
    transactionProductService;
    constructor(){
        this.prisma = prisma;
        this.transactionProductService = new TransactionProductService();
    }

    async getAllProductsWithStock(req: Request, res: Response){
        const user = req.user as Users;
        if(user.role !== 'SUPER_ADMIN' && user.role !== 'WAREHOUSE_ADMIN'){
            return res.status(403).json({ message: "Forbidden" });
        }
        const transactionProducts = req.body.transactionProducts as TransactionsProducts[];
        const warehouseId = req.body.warehouseId as number;
        if(!transactionProducts){
            return res.status(400).json({ message: "Bad Request" });
        }

        const result: TransactionProductWithStockModel[] = await Promise.all(transactionProducts.map(async (transactionProduct: TransactionsProducts) => {
            let productWarehouse: ProductsWarehouses = await this.transactionProductService.getProductWarehouseByProductId(transactionProduct.productId, warehouseId) as ProductsWarehouses;
            if(!productWarehouse){
                await this.transactionProductService.createProductWarehouse(transactionProduct.productId, warehouseId);
                productWarehouse = await this.transactionProductService.getProductWarehouseByProductId(transactionProduct.productId, warehouseId) as ProductsWarehouses;
            }

            const stock = productWarehouse.stock;
            const globalStock = await this.transactionProductService.getGlobalStockbyProductId(transactionProduct.productId);
            const productWithStock: TransactionProductWithStockModel = {
                ...transactionProduct,
                stock: stock,
                globalStock: globalStock._sum.stock
            };
            return productWithStock;
        }));
        if(result.length===0){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(result);
    }
}
