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
      this.ProductStockController.createHistory,
    );
    this.router.post(
      '/admin/product-categories',
      requireJwtAuth,
      this.ProductCategoryController.createProductCategory,
    );
    this.router.post(
      '/admin/mutation',
      this.ProductStockController.createMutationRequest,
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
    this.router.get(
      '/products/product-all-names',
      this.ProductController.getProductNames,
    );
    this.router.get(
      '/admin/mutation/:id',
      this.ProductStockController.getMutationRequest,
    );
    this.router.get(
      '/admin/incoming-mutation/:id',
      this.ProductStockController.getIncomingMutationRequest,
    );
    this.router.get(
      '/admin/test-mutation',
      this.AdminProductController.testAutoMutation,
    );
    this.router.get(
      '/admin/mutation-form/:id',
      this.ProductStockController.getProductsWarehouses,
    );
    this.router.patch(
      '/admin/products/:id',
      requireJwtAuth,
      this.AdminProductController.updateProduct,
    );
    this.router.patch(
      '/admin/mutation',
      this.ProductStockController.processMutationRequest,
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
    this.router.get(
      '/admin/product-warehouses/:id',
      this.ProductCategoryController.getWarehouseById,
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
