import { mutationType } from '@prisma/client';
import { prisma } from '../prisma.service';

export default class ProductStockService {
  prisma;
  constructor() {
    this.prisma = prisma;
  }

  async getWarehousesExclude(warehouseId: number[]) {
    return prisma.warehouses.findMany({
      where: {
        archived: false,
        NOT: {
          OR: warehouseId.map((id) => ({ id })),
        },
      },
    });
  }
  async getProductWarehouse(id: number) {
    return prisma.warehouses.findUnique({
      where: {
        id,
      },
    });
  }

  async createHistory(
    productId: number,
    warehouseId: number,
    isAdd: boolean,
    quantity: number,
    mutationType: mutationType,
  ) {
    return prisma.mutations.create({
      data: {
        productId,
        warehouseId,
        isAdd,
        quantity,
        mutationType,
      },
    });
  }

  async createMutationRequest(
    productId: number,
    warehouseId: number,
    destinationWarehouseId: number,
    isAdd: boolean,
    quantity: number,
    mutationType: mutationType,
  ) {
    return prisma.mutations.create({
      data: {
        productId,
        warehouseId,
        destinationWarehouseId,
        isAdd,
        quantity,
        mutationType,
      },
    });
  }

  async automatedMutationRequest(
    productId: number,
    warehouseId: number,
    destinationWarehouseId: number,
    quantity: number,
  ) {
    return prisma.mutations.create({
      data: {
        productId,
        warehouseId,
        destinationWarehouseId,
        isAdd: true,
        quantity,
        mutationType: 'AUTOMATED',
        isAccepted: true,
      },
    });
  }

  async processMutationRequest(id: number, isAccepted: boolean) {
    return prisma.mutations.update({
      where: {
        id: id,
      },
      data: {
        isAccepted: isAccepted,
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
