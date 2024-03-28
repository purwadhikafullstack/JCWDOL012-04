import { Response } from 'express';
import ProductService from '@/services/products/product.service';

export default async function productCheck(
  productId: number,
  res: Response,
): Promise<boolean> {
  const productService = new ProductService();
  const product = await productService.getProduct(productId);
  if (product === null) {
    res.status(404).json({ message: 'Product not found' });
    return false;
  }
  return true;
}
