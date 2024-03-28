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
        path: `http://localhost:8000/images/products/${file.filename}`,
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

export function getDateFromMonthAndYear(monthYearString: string) {
  // Split the monthYearString into month and two-digit year parts
  const [month, twoDigitYear] = monthYearString.split(' ');

  // Convert the two-digit year to a four-digit year
  const fullYear =
    new Date().getFullYear().toString().slice(0, 2) + twoDigitYear;

  // Convert the month name to its corresponding numerical representation
  const monthNameToNumber: { [key: string]: number } = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Create a new Date object with the specified month and year
  const date = new Date(Number(fullYear), monthNameToNumber[month] as number);
  return date;
}
