import { Request, Response } from 'express';
import { sameProductCategory } from '@/lib/productsHelper';
import ProductCategoryService from '@/services/products/product.category.service';

const productCategoryService = new ProductCategoryService();

export class ProductCategoryController {
  async createProductCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const existedProductCategory =
        await productCategoryService.findProductCategoryName(name);
      if (existedProductCategory) return sameProductCategory(res);
      const productCategory =
        await productCategoryService.createProductCategory(name, description);
      res.status(201).json(productCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductCategories(req: Request, res: Response) {
    try {
      const productCategories =
        await productCategoryService.getProductCategories();
      return res.status(200).json(productCategories);
    } catch (error) {
      console.log(error);
    }
  }

  async getFullProductCategories(req: Request, res: Response) {
    try {
      const { page, pageSize, sort } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedPageSize = parseInt(pageSize as string, 10);
      const skip = (parsedPage - 1) * parsedPageSize;
      const productCategories =
        await productCategoryService.getFullProductCategories(
          parsedPageSize,
          skip,
          sort as string,
        );
      const totalProductCategories =
        await productCategoryService.getTotalProductCategories();
      const response = {
        productCategories,
        totalProductCategories,
      };
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductCategory(req: Request, res: Response) {
    try {
      const proCatId = parseInt(req.params.id);
      const productCategory =
        await productCategoryService.getProductCategory(proCatId);
      res.status(200).json(productCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      const currentProductCategory =
        await productCategoryService.getProductCategory(id);
      if (name !== currentProductCategory?.name) {
        const duplicateProduct =
          await productCategoryService.findProductCategoryName(name);
        if (duplicateProduct) sameProductCategory(res);
      }
      const updatedProductCategory =
        await productCategoryService.updateProductCategory(
          id,
          name,
          description,
        );
      res.status(201).json(updatedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductCategory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletedProductCategory =
        await productCategoryService.deleteProductCategory(id);
      return res.status(200).json(deletedProductCategory);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductWarehouse(req: Request, res: Response) {
    try {
      const productWarehouses =
        await productCategoryService.getProductWarehouse();
      return res.status(200).json(productWarehouses);
    } catch (error) {
      console.log(error);
    }
  }

  async getWarehouseById(req: Request, res: Response) {
    try {
      const warehouseId = parseInt(req.params.id);
      const productWarehouses =
        await productCategoryService.getWarehouseById(warehouseId);
      return res.status(200).json(productWarehouses);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductImage(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletedProductImage =
        await productCategoryService.deleteProductImages(id);
      return res.status(200).json(deletedProductImage);
    } catch (error) {
      console.log(error);
    }
  }
}
