import { Request, Response } from 'express';
import { getDateFromMonthAndYear } from '@/lib/productsHelper';
import ReportService from '@/services/report.service';
import ProductService from '@/services/products/product.service';
import ProductStockService from '@/services/products/product.stock.service';

const reportService = new ReportService();
const productStockService = new ProductStockService();
const productService = new ProductService();

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
  async getMonthlySummary(req: Request, res: Response) {
    try {
      const { page, pageSize, startMonth, endMonth, warehouse, warehouseId } =
        req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const products = await reportService.getProducts(parsedPageSize, skip);
      const monthlyAdd = await Promise.all(
        products.map(async (product) => {
          const addHistory = await reportService.getMonthlyAddHistory(
            Number(startMonth),
            Number(endMonth),
            warehouse as string,
            product.id,
          );
          const subtractHistory = await reportService.getMonthlySubtractHistory(
            Number(startMonth),
            Number(endMonth),
            warehouse as string,
            product.id,
          );
          if (warehouse?.length === 0) {
            const finalStock = await productService.getTotalStock(product.id);
            return {
              ...product,
              add: addHistory._sum.quantity || 0,
              min: subtractHistory._sum.quantity || 0,
              stock: finalStock,
            };
          } else {
            const finalStock = await productStockService.findProductWarehouse(
              product.id,
              Number(warehouseId),
            );
            return {
              ...product,
              add: addHistory._sum.quantity || 0,
              min: subtractHistory._sum.quantity || 0,
              stock: finalStock?.stock,
            };
          }
        }),
      );
      const totalProducts = await productService.getTotalProduct('', '');
      return res.status(200).json({ monthlyAdd, totalProducts });
    } catch (error) {
      console.log(error);
    }
  }

  async getMonthlyHistory(req: Request, res: Response) {
    try {
      const { page, pageSize, startMonth, endMonth, product, warehouse } =
        req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const monthlyHistory = await reportService.getMonthlyHistory(
        Number(startMonth),
        Number(endMonth),
        product as string,
        warehouse as string,
        parsedPageSize,
        skip,
      );
      const totalMutations = await reportService.getTotalMutations(
        product as string,
        warehouse as string,
        Number(startMonth),
        Number(endMonth),
      );
      return res.status(200).json({ monthlyHistory, totalMutations });
    } catch (error) {
      console.log(error);
    }
  }
}
