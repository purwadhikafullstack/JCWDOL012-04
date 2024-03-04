interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
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
