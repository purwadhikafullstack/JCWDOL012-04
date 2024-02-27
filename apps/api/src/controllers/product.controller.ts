import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ProductController {
  //products
  async getProducts(req: Request, res: Response) {
    try {
      const products = await prisma.products.findMany({
        include: {
          productImages: true,
          productsWarehouses: {
            select: {
              stock: true,
              warehouse: {
                select: {
                  id: true,
                },
              },
            },
          },
          productCategory: true,
        },
      });
      const productsWithTotalStock = products.map((product) => {
        const totalStock = product.productsWarehouses.reduce(
          (total, warehouse) => total + warehouse.stock,
          0,
        );
        return { ...product, totalStock };
      });
      return res.status(200).json(productsWithTotalStock);
    } catch (error) {
      console.log(error);
    }
  }

  //product
  async getProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await prisma.products.findUnique({
        where: {
          id: id,
        },
      });
      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
    }
  }

  //products search
  async searchProducts(req: Request, res: Response) {
    try {
      const search = req.params.search;
      const products = await prisma.products.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
    }
  }
}
