import { Request, Response, Router } from "express";
import TransactionController from '../controllers/transaction.controller.withAuth';
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { uploadPaymentProof } from "@/lib/payment.proof.multer";
import cors from 'cors';

const transactionRouter = Router();

const transactionController = new TransactionController();

transactionRouter.get('/address', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getUsersByUserId(req, res);
});

transactionRouter.post('/pretransaction', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.preTransaction(req, res);
});

transactionRouter.post('/paymentGatewayNotif', (req: Request, res: Response): void => {
    transactionController.handlePaymentGatewayNotif(req, res);
});

transactionRouter.get('/', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getAll(req, res);
});

transactionRouter.get('/admin', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getAllForAdmin(req, res);
});

transactionRouter.get('/orderstatus', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getAllOrderStatus(req, res);
});

transactionRouter.get('/productcategory', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getAllProductCategory(req, res);
});

transactionRouter.get('/orders/latest', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getLatestTransactionUid(req, res);
});

transactionRouter.get('/orders/:transactionUid', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getTransactionByUid(req, res);
});

transactionRouter.get('/admin/orders/:transactionUid', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.getTransactionByUidAdmin(req, res);
});

transactionRouter.post('/orders/cancel', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.cancelOrder(req, res);
});

transactionRouter.post('/orders/confirm', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.confirmOrder(req, res);
});

transactionRouter.post('/orders/paymentProof', requireJwtAuth, uploadPaymentProof, (req: Request, res: Response): void => {
    transactionController.postPaymentProof(req, res);
});

transactionRouter.post('/admin/orders/verify', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.verifyPaymentProof(req, res);
});

transactionRouter.post('/admin/orders/deny', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.denyPaymentProof(req, res);
});

transactionRouter.post('/admin/orders/process', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.processOrder(req, res);
});

transactionRouter.post('/admin/orders/ship', requireJwtAuth, (req: Request, res: Response): void => {
    transactionController.shipOrder(req, res);
});

export default transactionRouter;