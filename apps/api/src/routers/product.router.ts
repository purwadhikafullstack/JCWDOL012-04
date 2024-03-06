import { ProductController } from '@/controllers/product.controller';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private ProductController: ProductController;

  constructor() {
    this.ProductController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/products', this.ProductController.getProductsUser);
    this.router.get('/admin/products', this.ProductController.getProductsAdmin);
    this.router.post('/admin/products', this.ProductController.createProduct);
    this.router.get(
      '/product-categories',
      this.ProductController.getProductCategories,
    );
    this.router.get('/product/:id', this.ProductController.getProduct);
    this.router.get(
      '/products/product-names',
      this.ProductController.searchProducts,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
