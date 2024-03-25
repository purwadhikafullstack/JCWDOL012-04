import { mutationType } from '@prisma/client';
import { prisma } from '../prisma.service';

export default class ProductStockService {
  prisma;
  constructor() {
    this.prisma = prisma;
  }

  async getWarehousesExclude(warehouseId: number[]) {
    return this.prisma.warehouses.findMany({
      where: {
        archived: false,
        NOT: {
          OR: warehouseId.map((id) => ({ id })),
        },
      },
    });
  }
  async getProductWarehouse(id: number) {
    return this.prisma.warehouses.findUnique({
      where: {
        id,
      },
    });
  }
  async getMutationRequest(id: number) {
    return this.prisma.mutations.findMany({
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
    return this.prisma.mutations.findMany({
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
    return this.prisma.mutations.create({
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
    return this.prisma.mutations.create({
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
    return this.prisma.mutations.create({
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
    return this.prisma.mutations.update({
      where: {
        id: id,
      },
      data: {
        isAccepted: isAccepted,
      },
    });
  }

  async findProductWarehouse(productId: number, warehouseId: number) {
    return this.prisma.productsWarehouses.findFirst({
      where: {
        productId: productId,
        warehouseId: warehouseId,
      },
    });
  }

  async updateStock(id: number, updatedStock: number) {
    return this.prisma.productsWarehouses.update({
      where: {
        id: id,
      },
      data: {
        stock: updatedStock,
      },
    });
  }
}
