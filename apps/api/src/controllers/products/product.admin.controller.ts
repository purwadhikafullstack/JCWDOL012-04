import { Request, Response } from 'express';
import { Products } from '@prisma/client';
import { upload } from '@/lib/product.multer';
import {
  productsTotalStock,
  parseProWare,
  mapProImages,
  sameProduct,
} from '@/lib/productsHelper';
import ProductService from '@/services/products/product.service';
import AdminProductService from '@/services/products/product.admin.service';
import { ProductStockController } from './product.stock.controller';
import ProductStockService from '@/services/products/product.stock.service';

const productService = new ProductService();
const adminProductService = new AdminProductService();
const productStockController = new ProductStockController();
const productStockService = new ProductStockService();

interface getAdminProducts extends Products {
  productsWarehouses: {
    stock: number;
    warehouse: {
      id: number;
    };
  }[];
}

export class AdminProductController {
  async createProduct(req: Request, res: Response) {
    try {
      upload(req, res, async () => {
        const { name, description, price, weight, productCategoryId } =
          req.body;
        const productsWarehouses = parseProWare(req.body.productsWarehouses);
        const existedProduct = await adminProductService.findProductName(name);
        if (existedProduct) return sameProduct(res);
        const productImages = mapProImages(req.files);
        const createdProduct = await AdminProductService.createProduct(
          name,
          description,
          parseInt(price),
          parseInt(weight),
          parseInt(productCategoryId),
          productImages,
          productsWarehouses,
        );
        res.status(201).json(createdProduct);
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getProductsAdmin(req: Request, res: Response) {
    try {
      const { page, pageSize, search, category, sort } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const products = (await adminProductService.getAllAdminProducts(
        parsedPageSize,
        skip,
        search as string,
        category as string,
        sort as string,
      )) as getAdminProducts[];
      const totalProducts = await productService.getTotalProduct(
        search as string,
        category as string,
      );
      const productsWithTotalStock = productsTotalStock(products);
      const response = {
        products: productsWithTotalStock,
        totalProducts: totalProducts,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async getAdminProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await adminProductService.getAdminProduct(id);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      upload(req, res, async () => {
        const id = parseInt(req.params.id);
        const { name, description, price, weight, productCategoryId } =
          req.body;
        const currentProduct = await adminProductService.getAdminProduct(id);
        if (name !== currentProduct?.name) {
          const duplicateProduct =
            await adminProductService.findProductName(name);
          if (duplicateProduct) return sameProduct(res);
        }
        const updatedProductImages = mapProImages(req.files);
        const updatedProduct = await adminProductService.updateProduct(
          id,
          name,
          description,
          parseInt(price),
          parseInt(weight),
          parseInt(productCategoryId),
          updatedProductImages,
        );
        res.status(200).json(updatedProduct);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id: rawId } = req.params;
      const id = parseInt(rawId);
      const deletedProduct = await adminProductService.deleteProduct(id);
      return res.status(200).json(deletedProduct);
    } catch (error) {
      console.log(error);
    }
  }
  async testAutoMutation(req: Request, res: Response) {
    try {
      const warehouseId = 1;
      const transactionId = 3;
      const productId = 4;
      const rawQuantity = 30;
      const warehouseStock = await productStockService.findProductWarehouse(
        productId,
        warehouseId,
      );
      if (rawQuantity > warehouseStock?.stock!) {
        const automatedMutation =
          await productStockController.automatedMutation(
            warehouseId,
            productId,
            transactionId,
            rawQuantity,
          );
        return res.status(201).json(automatedMutation);
      }
      return res
        .status(200)
        .json({ message: 'warehouse stock meet the required quantity' });
    } catch (error) {
      console.log(error);
    }
  }
}
