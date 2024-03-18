import { prisma } from '../prisma.service';

export default class ProductCategoryService {
  prisma;
  constructor() {
    this.prisma = prisma;
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
