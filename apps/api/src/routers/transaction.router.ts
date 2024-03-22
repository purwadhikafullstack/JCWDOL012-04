import { Request, Response, Router } from "express";
import TransactionController from '../controllers/transaction.controller';

const transactionRouter = Router();

const transactionController = new TransactionController();

transactionRouter.get('/address', (req: Request, res: Response): void => {
    transactionController.getUsersByUserId(req, res);
});

transactionRouter.post('/pretransaction', (req: Request, res: Response): void => {
    transactionController.preTransaction(req, res);
});

transactionRouter.post('/paymentGatewaySuccess', (req: Request, res: Response): void => {
    transactionController.handlePaymentGatewaySuccess(req, res);
});

transactionRouter.post('/paymentGatewayFailed', (req: Request, res: Response): void => {
    transactionController.handlePaymentGatewayFailed(req, res);
});

export default transactionRouter;