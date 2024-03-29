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
          orderStatus: 'SHIPPING' || 'CONFIRMED',
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
          orderStatus: 'SHIPPING' || 'CONFIRMED',
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
    warehouse: string,
    productId: number,
  ) {
    return await this.prisma.mutations.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        isAdd: true,
        warehouse: {
          name: {
            contains: warehouse,
          },
        },
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
    warehouse: string,
    productId: number,
  ) {
    return await this.prisma.mutations.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId: productId,
        OR: [
          {
            isAccepted: true,
            isAdd: true,
            destinationWarehouse: {
              name: {
                contains: warehouse,
              },
            },
          },
          {
            isAccepted: null,
            isAdd: false,
            warehouse: {
              name: {
                contains: warehouse,
              },
            },
          },
        ],
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lte: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
    });
  }

  async getMonthlyHistory(
    startMonth: number,
    endMonth: number,
    product: string,
    warehouse: string,
    take: number,
    skip: number,
  ) {
    return this.prisma.mutations.findMany({
      where: {
        product: {
          name: {
            contains: product,
          },
        },
        OR: [
          {
            warehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: 'REQUEST',
            isAccepted: true,
          },
          {
            warehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: {
              not: 'REQUEST',
            },
          },
          {
            destinationWarehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: 'REQUEST',
            isAccepted: true,
          },
          {
            destinationWarehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: {
              not: 'REQUEST',
            },
          },
        ],
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lte: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        destinationWarehouse: {
          select: {
            name: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
      take,
      skip,
      orderBy: {
        id: 'desc',
      },
    });
  }
  async getTotalMutations(
    product: string,
    warehouse: string,
    startMonth: number,
    endMonth: number,
  ) {
    return this.prisma.mutations.count({
      where: {
        product: {
          name: {
            contains: product,
          },
        },
        OR: [
          {
            warehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: 'REQUEST',
            isAccepted: true,
          },
          {
            warehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: {
              not: 'REQUEST',
            },
          },
          {
            destinationWarehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: 'REQUEST',
            isAccepted: true,
          },
          {
            destinationWarehouse: {
              name: {
                contains: warehouse,
              },
            },
            mutationType: {
              not: 'REQUEST',
            },
          },
        ],
        createdAt: {
          gte: new Date(
            new Date().setMonth(new Date().getMonth() - startMonth),
          ),
          lte: new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
        },
      },
    });
  }
  async getProducts(take: number, skip: number) {
    return this.prisma.products.findMany({
      where: {
        archived: false,
      },
      select: {
        id: true,
        name: true,
      },
      take,
      skip,
    });
  }
}
