import { prisma } from './prisma.service';

export default class SalesService {
  prisma;
  constructor() {
    this.prisma = prisma;
  }

  async getMonthlySales(
    warehouse: string,
    productCategory: string,
    product: string,
    startMonth: number,
    endMonth: number,
  ) {
    return await this.prisma.transactionsProducts.aggregate({
      _sum: {
        quantity: true,
        price: true,
      },
      where: {
        transaction: {
          archived: false,
          orderStatus: 'SENT' || 'CONFIRMED',
          warehouse: {
            name: {
              contains: warehouse,
            },
          },
        },
        product: {
          productCategory: {
            name: {
              contains: productCategory,
            },
          },
          name: {
            contains: product,
          },
        },
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lt: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
    });
  }
  async getRevenue(
    warehouse: string,
    productCategory: string,
    product: string,
  ) {
    return await this.prisma.transactionsProducts.aggregate({
      _sum: {
        price: true,
        quantity: true,
      },
      where: {
        transaction: {
          archived: false,
          orderStatus: 'SENT' || 'CONFIRMED',
          warehouse: {
            name: {
              contains: warehouse,
            },
          },
        },
        product: {
          productCategory: {
            name: {
              contains: productCategory,
            },
          },
          name: {
            contains: product,
          },
        },
      },
    });
  }
}
