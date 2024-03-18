import { Request, Response } from 'express';
import { prisma } from '@/services/prisma.service';
import ProductStockService from '@/services/products/product.stock.service';
import AdminProductService from '@/services/products/product.admin.service';

const productStockService = new ProductStockService();
const adminProductService = new AdminProductService();

export class ProductStockController {
  async updateStock(req: Request, res: Response) {
    try {
      const transaction = await prisma.$transaction(async () => {
        const warehouseId = parseInt(req.params.id);
        const { productId, quantity, transactionId, isAdd, mutationType } =
          req.body;
        console.log('req body => ', req.body);
        const mutation = await productStockService.createMutation(
          productId,
          warehouseId,
          transactionId,
          isAdd,
          quantity,
          mutationType,
        );
        console.log('mutation => ', mutation);
        const productWarehouse = await productStockService.findProductWarehouse(
          productId,
          warehouseId,
        );
        console.log('product warehouse => ', productWarehouse);
        const stock = isAdd
          ? productWarehouse?.stock + quantity
          : productWarehouse?.stock! - quantity;
        await productStockService.updateStock(productWarehouse?.id!, stock);
        return res.status(201).json(mutation);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
