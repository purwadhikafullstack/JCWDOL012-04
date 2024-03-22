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
  async getMutationRequest(id: number) {
    return prisma.mutations.findMany({
      where: {
        archived: false,
        mutationType: 'REQUEST',
        warehouseId: id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        destinationWarehouse: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getIncomingMutationRequest(id: number) {
    return prisma.mutations.findMany({
      where: {
        archived: false,
        mutationType: 'REQUEST',
        destinationWarehouseId: id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
  async getProducts() {
    return this.prisma.products.findMany({
      where: {
        archived: false,
      },
      select: {
        id: true,
        name: true,
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
    quantity: number,
  ) {
    return prisma.mutations.create({
      data: {
        productId,
        warehouseId,
        destinationWarehouseId,
        isAdd: true,
        quantity,
        mutationType: 'REQUEST',
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
