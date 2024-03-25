import { Request, Response } from 'express';
import SalesService from '@/services/sales.service';

const salesService = new SalesService();

interface MonthlySales {
  quantity: number | null;
  price: number | null;
  month: string;
}

export class SalesController {
  async getMonthlySales(req: Request, res: Response) {
    try {
      const { warehouse, productCategory, product } = req.query;
      const startMonth = 12;
      let endMonth = 0;
      const rawMonthlySales: MonthlySales[] = [];
      for (let i = 0; i <= startMonth; i++) {
        const monthSales = await salesService.getMonthlySales(
          warehouse as string,
          productCategory as string,
          product as string,
          i + 1,
          endMonth,
        );
        rawMonthlySales.push({
          ...monthSales._sum,
          month: `${new Date(
            new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
          ).toLocaleString('en-US', { month: 'long' })} ${new Date(
            new Date(new Date().setMonth(new Date().getMonth() - endMonth)),
          ).toLocaleString('en-US', { year: '2-digit' })}`,
        });
        endMonth++;
      }
      const revenue = await salesService.getRevenue(
        warehouse as string,
        productCategory as string,
        product as string,
      );
      const sanitizedMonthSales = rawMonthlySales.map((item) => ({
        quantity: item.quantity || 0,
        price: item.price || 0,
        month: item.month,
      }));
      const monthlySales = sanitizedMonthSales.reverse();
      const response = {
        monthlySales,
        revenue: revenue._sum,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }
}
