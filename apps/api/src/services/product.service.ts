import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts(
    parsedPageSize: number,
    skip: number,
    search: string,
    category: string,
    sort: string | undefined,
  ) {
    const query: any = {
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
      take: parsedPageSize,
      skip,
      where: {
        name: {
          contains: search,
        },
        productCategory: {
          name: {
            contains: category,
          },
        },
      },
    };

    if (sort) {
      query.orderBy = {
        price: sort as Prisma.SortOrder,
      };
    }

    return prisma.products.findMany(query);
  }

  async getTotalProduct(search: string, category: string) {
    return prisma.products.count({
      where: {
        name: {
          contains: search,
        },
        productCategory: {
          name: {
            contains: category,
          },
        },
      },
    });
  }

  async getProductCategories() {
    return prisma.productCategories.findMany();
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
      select: {
        name: true,
      },
      where: {
        name: {
          contains: search,
        },
      },
      take: 7,
    });
  }
}
