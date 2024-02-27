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
    this.router.get('/products', this.ProductController.getProducts);
    this.router.get('/product/:id', this.ProductController.getProduct);
    this.router.get(
      '/products/search=:search',
      this.ProductController.searchProducts,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
