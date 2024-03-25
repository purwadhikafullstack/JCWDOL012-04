import { Prisma, ProductsWarehouses } from '@prisma/client';
import { prisma } from '../prisma.service';

export default class AdminProductService {
  prisma;
  constructor() {
    this.prisma = prisma;
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
        productImages: {
          where: {
            archived: false,
          },
        },
        productsWarehouses: true,
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

  async getAdminProduct(id: number) {
    return this.prisma.products.findUnique({
      where: {
        id,
        archived: false,
      },
      include: {
        productImages: {
          where: {
            archived: false,
          },
        },
        productsWarehouses: true,
        productCategory: true,
      },
    });
  }

  static async createProduct(
    name: string,
    description: string,
    price: number,
    productCategoryId: number,
    productImages: { path: string }[],
    productsWarehouses: ProductsWarehouses,
  ) {
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

  async updateProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    productCategoryId: number,
    productImages: { path: string }[],
  ) {
    const updatedProduct = await this.prisma.products.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        price,
        productCategoryId,
        productImages: {
          create: productImages,
        },
      },
      include: {
        productImages: true,
      },
    });
    return updatedProduct;
  }

  async deleteProduct(productId: number) {
    return this.prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        archived: true,
      },
    });
  }

  async findProductName(productName: string) {
    return this.prisma.products.findFirst({
      where: {
        name: productName,
        archived: false,
      },
    });
  }
}
