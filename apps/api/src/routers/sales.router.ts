import { SalesController } from '@/controllers/sales.controller';
import { Router } from 'express';
import { requireJwtAuth } from '@/middlewares/auth/requireJwtAuth';

export class SalesRouter {
  private router: Router;
  private SalesController: SalesController;

  constructor() {
    this.SalesController = new SalesController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.SalesController.getMonthlySales);
  }

  getRouter(): Router {
    return this.router;
  }
}
