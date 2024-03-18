import ProductService from '@/services/products/product.service';
import { Products } from '@prisma/client';
import { Response } from 'express';

interface Product extends Products {
  productsWarehouses: productsWarehouse[];
}

interface productsWarehouse {
  stock: number;
  warehouse: {
    id: number;
  };
}

export function productsTotalStock(products: Product[]) {
  return products.map((product) => {
    const totalStock = product.productsWarehouses.reduce(
      (total: number, warehouse: productsWarehouse) => total + warehouse.stock,
      0,
    );
    return { ...product, totalStock };
  });
}

export async function userProductsTotalStock(
  products: Product[],
  productService: ProductService,
) {
  return Promise.all(
    products.map(async (product) => {
      const totalStock = await productService.getTotalStock(product.id);
      return {
        ...product,
        totalStock: totalStock || 0,
      };
    }),
  );
}

export function parseProWare(productWarehouses: any) {
  return productWarehouses ? JSON.parse(productWarehouses) : [];
}

export function mapProImages(productImages: any) {
  return Array.isArray(productImages)
    ? productImages.map((file: Express.Multer.File) => ({
        path: `http://localhost:8000/public/images/products/${file.filename}`,
      }))
    : [];
}

export function sameProduct(res: Response) {
  return res
    .status(400)
    .json({ error: 'Product with the same name already exists.' });
}
export function sameProductCategory(res: Response) {
  return res
    .status(400)
    .json({ error: 'Product Category name already exist!' });
}
