import { ProductController } from '@/controllers/product.controller';
import { AdminProductController } from '@/controllers/product.admin.controller';
import { Router } from 'express';
import { requireJwtAuth } from '@/middlewares/auth/requireJwtAuth';

export class ProductRouter {
  private router: Router;
  private ProductController: ProductController;
  private AdminProductController: AdminProductController;

  constructor() {
    this.ProductController = new ProductController();
    this.AdminProductController = new AdminProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/admin/products',
      requireJwtAuth,
      this.AdminProductController.createProduct,
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
    this.router.post(
      '/admin/product-categories',
      requireJwtAuth,
      this.AdminProductController.createProductCategory,
    );
    this.router.get(
      '/admin/product-categories',
      requireJwtAuth,
      this.AdminProductController.getFullProductCategories,
    );
    this.router.get(
      '/product-categories',
      this.ProductController.getProductCategories,
    );
    this.router.get(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.AdminProductController.getProductCategory,
    );
    this.router.patch(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.AdminProductController.updateProductCategory,
    );
    this.router.put(
      '/admin/product-categories/:id',
      requireJwtAuth,
      this.AdminProductController.deleteProductCategory,
    );
    this.router.get(
      '/admin/product-warehouses',
      requireJwtAuth,
      this.AdminProductController.getProductWarehouse,
    );
    this.router.put(
      '/admin/product-images/:id',
      requireJwtAuth,
      this.AdminProductController.deleteProductImage,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
