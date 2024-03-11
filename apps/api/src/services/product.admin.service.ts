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
        productImages: true,
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
      },
    };
    if (sort) {
      query.orderBy = {
        price: sort as Prisma.SortOrder,
      };
    }
    return this.prisma.products.findMany(query);
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

  async updateProduct(productId: number, product: any) {
    return this.prisma.products.update({
      where: {
        id: productId,
      },
      data: product,
    });
  }

  async deleteProduct(productId: number) {
    return this.prisma.products.delete({
      where: {
        id: productId,
      },
    });
  }

  async findProductName(productName: string) {
    return this.prisma.products.findFirst({
      where: {
        name: productName,
      },
    });
  }
  async findProductCategoryName(productCatName: string) {
    return this.prisma.productCategories.findFirst({
      where: {
        name: productCatName,
      },
    });
  }
  async createProductCategory(name: string, description: string) {
    return this.prisma.productCategories.create({
      data: {
        name,
        description,
      },
    });
  }
  async getFullProductCategories(
    parsedPageSize: number,
    skip: number,
    sort: string,
  ) {
    return this.prisma.productCategories.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        products: {
          select: {
            id: true,
          },
          where: {
            archived: false,
          },
        },
      },
      where: {
        archived: false,
      },
      take: parsedPageSize,
      skip,
      orderBy: {
        name: sort as 'asc' | 'desc',
      },
    });
  }

  async getTotalProductCategories() {
    return this.prisma.productCategories.count({
      where: {
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
  async getProductCategory(proCatId: number) {
    return this.prisma.productCategories.findUnique({
      where: {
        id: proCatId,
      },
    });
  }
  async updateProductCategory(
    productCatId: number,
    name: string,
    description: string,
  ) {
    return this.prisma.productCategories.update({
      where: {
        id: productCatId,
      },
      data: {
        name,
        description,
      },
    });
  }
  async deleteProductCategory(productCatId: number) {
    return this.prisma.productCategories.update({
      where: {
        id: productCatId,
      },
      data: {
        archived: true,
      },
    });
  }
  async getProductWarehouse() {
    return prisma.warehouses.findMany();
  }
}
