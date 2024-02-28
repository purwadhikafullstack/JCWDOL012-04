import { Request, Response } from 'express';
import prisma from '@/prisma';
import { ProductService } from '@/services/product.service';

const productService = new ProductService();

export class ProductController {
  //products
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
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
      const product = await productService.getProduct(id);
      const singleProduct = product;

      // Calculate total stock for the single product
      const totalStock = singleProduct?.productsWarehouses.reduce(
        (total, warehouse) => total + warehouse.stock,
        0,
      );

      // Include the totalStock in the product object
      const productWithTotalStock = {
        ...singleProduct,
        totalStock,
      };
      return res.status(200).json(productWithTotalStock);
    } catch (error) {
      console.log(error);
    }
  }

  //products search
  async searchProducts(req: Request, res: Response) {
    try {
      const search = req.params.search;
      const products = await productService.searchProducts(search);
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
    }
  }
}
