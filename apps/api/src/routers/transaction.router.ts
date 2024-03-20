import { Request, Response, Router } from "express";
import TransactionController from '../controllers/transaction.controller';

const transactionRouter = Router();

const transactionController = new TransactionController();

transactionRouter.get('/address', (req: Request, res: Response): void => {
    transactionController.getUsersByUserId(req, res);
});


export default transactionRouter;