import {
  Prisma,
  Products,
  ProductImages,
  ProductsWarehouses,
} from '@prisma/client';
import { prisma } from './prisma.service';

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  productCategoryId: number;
  productImages: { path: string }[];
  productsWarehouses: { warehouseId: number; stock: number }[];
}

interface UpdateProductInput {
  id: number;
  name: string;
  description: string;
  price: number;
  productCategoryId: number;
  productImages: { path: string }[];
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

  async updateProduct(input: UpdateProductInput) {
    const { id, name, description, price, productCategoryId, productImages } =
      input;
    const updatedProduct = await prisma.products.update({
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
  async findProductCategoryName(productCatName: string) {
    return this.prisma.productCategories.findFirst({
      where: {
        name: productCatName,
        archived: false,
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
    return prisma.warehouses.findMany({
      where: {
        archived: false,
      },
    });
  }
  async deleteProductImages(id: number) {
    return this.prisma.productImages.update({
      where: {
        id: id,
      },
      data: {
        archived: true,
      },
    });
  }
}
