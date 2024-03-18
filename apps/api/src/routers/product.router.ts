import { ProductController } from '@/controllers/products/product.controller';
import { AdminProductController } from '@/controllers/products/product.admin.controller';
import { ProductCategoryController } from '@/controllers/products/product.category.controller';
import { ProductStockController } from '@/controllers/products/product.stock.controller';
import { Router } from 'express';
import { requireJwtAuth } from '@/middlewares/auth/requireJwtAuth';

export class ProductRouter {
  private router: Router;
  private ProductController: ProductController;
  private AdminProductController: AdminProductController;
  private ProductCategoryController: ProductCategoryController;
  private ProductStockController: ProductStockController;

  constructor() {
    this.ProductController = new ProductController();
    this.AdminProductController = new AdminProductController();
    this.ProductCategoryController = new ProductCategoryController();
    this.ProductStockController = new ProductStockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/admin/products',
      requireJwtAuth,
      this.AdminProductController.createProduct,
    );
    this.router.post(
      '/admin/product-warehouses/:id',
      requireJwtAuth,
      this.ProductStockController.updateStock,
    );
    this.router.post(
      '/admin/product-categories',
      requireJwtAuth,
      this.ProductCategoryController.createProductCategory,
    );
    this.router.get('/products', this.ProductController.getProductsUser);
    this.router.get(
      '/admin/products',
      requireJwtAuth,
      this.AdminProductController.getProductsAdmin,
    );
    this.router.get('/product/:id', this.ProductController.getProduct);
    this.router.get(
      '/admin/products/:id',
      requireJwtAuth,
      this.AdminProductController.getAdminProduct,
    );
    this.router.get(
      '/products/product-names',
      this.ProductController.searchProducts,
    );
    this.router.patch(
      '/admin/products/:id',
      requireJwtAuth,
      this.AdminProductController.updateProduct,
    );
    this.router.put(
      '/admin/products/:id',
      requireJwtAuth,
      this.AdminProductController.deleteProduct,
    );
    this.router.get(
      '/admin/product-categories',
      requireJwtAuth,
      this.ProductCategoryController.getFullProductCategories,
    );
    this.router.get(
      '/product-categories',
      this.ProductController.getProductCategories,
    );
    this.router.get(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.ProductCategoryController.getProductCategory,
    );
    this.router.patch(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.ProductCategoryController.updateProductCategory,
    );
    this.router.put(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.ProductCategoryController.deleteProductCategory,
    );
    this.router.get(
      '/admin/product-warehouses',
      this.ProductCategoryController.getProductWarehouse,
    );
    this.router.put(
      '/admin/product-images/:id',
      requireJwtAuth,
      this.ProductCategoryController.deleteProductImage,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
