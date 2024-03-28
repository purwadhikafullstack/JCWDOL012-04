import { Request, Response } from 'express';
import ReportService from '@/services/report.service';
import { getDateFromMonthAndYear } from '@/lib/productsHelper';

const reportService = new ReportService();

interface MonthlySales {
  quantity: number | null;
  price: number | null;
  month: string;
}

export class ReportController {
  async getMonthlySales(req: Request, res: Response) {
    try {
      const {
        warehouse,
        productCategory,
        product,
        startMonth,
        endMonth: rawEndMonth,
      } = req.query;
      // const startMonth = 12; default
      let endMonth = Number(rawEndMonth);
      const rawMonthlySales: MonthlySales[] = [];
      for (let i = 0; i <= Number(startMonth); i++) {
        const monthSales = await reportService.getMonthlySales(
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
        endMonth = endMonth + 1;
      }
      const sanitizedMonthSales = rawMonthlySales.map((item) => ({
        quantity: item.quantity || 0,
        price: item.price || 0,
        month: item.month,
      }));
      const monthlySales = sanitizedMonthSales.reverse();
      const revenue = await reportService.getRevenue(
        warehouse as string,
        productCategory as string,
        product as string,
        getDateFromMonthAndYear(monthlySales[0].month),
        getDateFromMonthAndYear(monthlySales[monthlySales.length - 1].month),
      );
      const response = {
        monthlySales,
        revenue: revenue._sum,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }
  async getMonthlyAddHistory(req: Request, res: Response) {
    try {
      // loop over product
      const startMonth = 1;
      const endMonth = 0;
      const productId = 3;
      const addHistory = await reportService.getMonthlyAddHistory(
        startMonth,
        endMonth,
        productId,
      );
      return res.status(200).json(addHistory._sum);
    } catch (error) {
      console.log(error);
    }
  }
}
