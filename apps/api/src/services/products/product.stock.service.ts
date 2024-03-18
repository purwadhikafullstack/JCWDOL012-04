import { mutationType } from '@prisma/client';
import { prisma } from '../prisma.service';

export default class ProductStockService {
  prisma;
  constructor() {
    this.prisma = prisma;
  }

  async getProductWarehouse() {
    return prisma.warehouses.findMany({
      where: {
        archived: false,
      },
    });
  }

  async createMutation(
    productId: number,
    warehouseId: number,
    transactionId: number,
    isAdd: boolean,
    quantity: number,
    mutationType: mutationType,
  ) {
    return prisma.mutations.create({
      data: {
        productId,
        warehouseId,
        transactionId,
        isAdd,
        quantity,
        mutationType,
      },
    });
  }

  async findProductWarehouse(productId: number, warehouseId: number) {
    return prisma.productsWarehouses.findFirst({
      where: {
        productId: productId,
        warehouseId: warehouseId,
      },
    });
  }

  async updateStock(id: number, updatedStock: number) {
    return prisma.productsWarehouses.update({
      where: {
        id: id,
      },
      data: {
        stock: updatedStock,
      },
    });
  }
}
