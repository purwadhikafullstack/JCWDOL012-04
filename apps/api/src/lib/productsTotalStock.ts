import { Products, ProductsWarehouses } from "@prisma/client";

export function productsTotalStock(products: (Products & { productsWarehouses: ProductsWarehouses[] })[]) {
  return products.map((product: Products & { productsWarehouses: ProductsWarehouses[] }) => {
    const totalStock = product.productsWarehouses.reduce(
      (total: number, warehouse: ProductsWarehouses) => total + warehouse.stock,
      0,
    );
    return { ...product, totalStock };
  });
}
