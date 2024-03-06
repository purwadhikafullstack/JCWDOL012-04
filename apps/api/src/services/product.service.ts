import { Prisma } from '@prisma/client';
import { prisma } from './prisma.service';

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  productCategoryId: number;
  productImages: { path: string }[];
  productsWarehouses: { warehouseId: number; stock: number }[];
}

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
        productImages: true,
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
    return this.prisma.products.findMany(query);
  }

  async getAllAdminProducts(
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
    return this.prisma.productCategories.findMany();
  }
  async getProduct(id: number) {
    return this.prisma.products.findUnique({
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

  static async createProduct(input: CreateProductInput) {
    const {
      name,
      description,
      price,
      productCategoryId,
      productImages,
      productsWarehouses,
    } = input;
    const createdProduct = await prisma.products.create({
      data: {
        name,
        description,
        price,
        productCategoryId,
        productImages: {
          create: productImages,
        },
        productsWarehouses: {
          create: productsWarehouses,
        },
      },
      include: {
        productImages: true,
        productsWarehouses: true,
      },
    });
    return createdProduct;
  }

  async searchProducts(search: string) {
    return this.prisma.products.findMany({
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
