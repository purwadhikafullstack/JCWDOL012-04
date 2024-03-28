import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.service';

export default class ProductService {
  prisma;
  constructor() {
    this.prisma = prisma;
  }
  async getAllUserProducts(
    parsedPageSize: number,
    skip: number,
    search: string,
    category: string,
    sort: string | undefined,
  ) {
    const query: any = {
      include: {
        productImages: {
          where: {
            archived: false,
          },
        },
        productCategory: true,
      },
      take: parsedPageSize,
      skip,
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        productCategory: {
          name: {
            contains: category,
          },
        },
        archived: false,
      },
    };
    if (sort) {
      query.orderBy = {
        price: sort as Prisma.SortOrder,
      };
    }
    return this.prisma.products.findMany(query);
  }

  async getTotalStock(id: number) {
    const totalStock = await this.prisma.productsWarehouses.aggregate({
      _sum: {
        stock: true,
      },
      where: {
        productId: id,
      },
    });
    return totalStock._sum.stock || 0;
  }
  async getTotalProduct(search: string, category: string) {
    return this.prisma.products.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        productCategory: {
          name: {
            contains: category,
          },
        },
        archived: false,
      },
    });
  }
  async getProductCategories() {
    return this.prisma.productCategories.findMany({
      where: {
        archived: false,
      },
    });
  }
  async getProduct(id: number) {
    return this.prisma.products.findUnique({
      where: {
        id: id,
      },
      include: {
        productImages: {
          where: {
            archived: false,
          },
        },
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
    return this.prisma.products.findMany({
      select: {
        name: true,
      },
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        archived: false,
      },
      take: 7,
    });
  }
  async getProductNames() {
    return this.prisma.products.findMany({
      select: {
        name: true,
      },
      where: {
        archived: false,
      },
    });
  }
}
