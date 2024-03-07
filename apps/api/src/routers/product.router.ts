import { ProductController } from '@/controllers/product.controller';
import { AdminProductController } from '@/controllers/product.admin.controller';
import { Router } from 'express';

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
      this.AdminProductController.createProduct,
    );
    this.router.get('/products', this.ProductController.getProductsUser);
    this.router.get(
      '/admin/products',
      this.AdminProductController.getProductsAdmin,
    );
    this.router.get('/product/:id', this.ProductController.getProduct);
    this.router.get(
      '/products/product-names',
      this.ProductController.searchProducts,
    );
    this.router.patch(
      '/admin/products/:id',
      this.AdminProductController.updateProduct,
    );
    this.router.delete(
      '/admin/products/:id',
      this.AdminProductController.deleteProduct,
    );
    this.router.post(
      '/admin/product-categories',
      this.AdminProductController.createProductCategory,
    );
    this.router.get(
      '/product-categories',
      this.ProductController.getProductCategories,
    );
    this.router.patch(
      '/admin/product-categories/:id',
      this.AdminProductController.updateProductCategory,
    );
    this.router.delete(
      '/admin/product-categories/:id',
      this.AdminProductController.deleteProductCategory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
