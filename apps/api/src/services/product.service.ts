import { PrismaClient, Products } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts() {
    return prisma.products.findMany({
      include: {
        productImages: true,
        productsWarehouses: {
          select: {
            stock: true,
            warehouse: {
              select: {
                id: true,
              },
            },
          },
        },
        productCategory: true,
      },
    });
  }

  async getProduct(id: number) {
    return prisma.products.findUnique({
      where: {
        id: id,
      },
      include: {
        productImages: true,
        productsWarehouses: {
          select: {
            stock: true,
            warehouse: {
              select: {
                id: true,
              },
            },
          },
        },
        productCategory: true,
      },
    });
  }

  async searchProducts(search: string) {
    return prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
  }
}
