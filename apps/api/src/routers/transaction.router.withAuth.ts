import { Request, Response, Router } from "express";
import TransactionController from '../controllers/transaction.controller.withAuth';
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";

const transactionRouter = Router();

const transactionController = new TransactionController();

transactionRouter.get('/address', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getUsersByUserId(req, res);
});

transactionRouter.post('/pretransaction', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.preTransaction(req, res);
});

transactionRouter.post('/paymentGatewaySuccess', (req: Request, res: Response): void => {
    transactionController.handlePaymentGatewaySuccess(req, res);
});

transactionRouter.post('/paymentGatewayFailed', (req: Request, res: Response): void => {
    transactionController.handlePaymentGatewayFailed(req, res);
});

export default transactionRouter;