import { ReportController } from '@/controllers/report.controller';
import { Router } from 'express';
import { requireJwtAuth } from '@/middlewares/auth/requireJwtAuth';

export class ReportRouter {
  private router: Router;
  private ReportController: ReportController;

  constructor() {
    this.ReportController = new ReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', requireJwtAuth, this.ReportController.getMonthlySales);
    this.router.get(
      '/stocks',
      requireJwtAuth,
      this.ReportController.getMonthlySummary,
    );
    this.router.get(
      '/products',
      requireJwtAuth,
      this.ReportController.getMonthlyHistory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
