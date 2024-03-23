import { Request, Response } from 'express';
import ProductService from '@/services/product.service';
import { userProductsTotalStock } from '@/lib/productsHelper';
import { Products } from '@prisma/client';

const productService = new ProductService();

interface Product extends Products {
  productsWarehouses: {
    stock: number;
    warehouse: {
      id: number;
    };
  }[];
}

export class ProductController {
  //products
  async getProductsUser(req: Request, res: Response) {
    try {
      const { page, pageSize, search, category, sort } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const products = (await productService.getAllUserProducts(
        parsedPageSize,
        skip,
        search as string,
        category as string,
        sort as string,
      )) as Product[];
      const totalProducts = await productService.getTotalProduct(
        search as string,
        category as string,
      );
      const productsWithTotalStock = await userProductsTotalStock(
        products,
        productService,
      );
      const response = {
        products: productsWithTotalStock,
        totalProducts: totalProducts,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductCategories(req: Request, res: Response) {
    try {
      const productCategories = await productService.getProductCategories();
      return res.status(200).json(productCategories);
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
      const totalStock = singleProduct?.productsWarehouses.reduce(
        (total, warehouse) => total + warehouse.stock,
        0,
      );
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
      const { search } = req.query;
      const products = await productService.searchProducts(search as string);
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
    }
  }
}
