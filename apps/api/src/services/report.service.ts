import { prisma } from './prisma.service';

export default class ReportService {
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
    startMonth: Date,
    endMonth: Date,
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
        createdAt: {
          gte: startMonth,
          lt: endMonth,
        },
      },
    });
  }
  async getMonthlyAddHistory(
    startMonth: number,
    endMonth: number,
    productId: number,
  ) {
    console.log(
      new Date(new Date().setMonth(new Date().getMonth() - startMonth)),
    );
    console.log(
      new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
    );
    return await this.prisma.mutations.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        isAdd: true,
        OR: [
          {
            isAccepted: true,
          },
          {
            isAccepted: null,
          },
        ],
        productId: productId,
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lte: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
    });
  }
  async getMonthlySubtractHistory(
    startMonth: number,
    endMonth: number,
    productId: number,
  ) {
    return await this.prisma.mutations.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        isAdd: false,
        productId: productId,
        OR: [{ isAccepted: true }, { isAccepted: null }],
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lte: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
    });
  }
}
