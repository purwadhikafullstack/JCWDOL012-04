import { Request, Response, Router } from "express";
import ShoppingCartController from '../controllers/cart.controller.withAuth';
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";

const cartRouter = Router();
const shoppingCartController = new ShoppingCartController();

cartRouter.get('/',requireJwtAuth, (req: Request, res: Response): void => {
    shoppingCartController.get(req, res);
});

cartRouter.get('/preAdd/:productId',requireJwtAuth, (req: Request, res: Response): void => {
    shoppingCartController.preAdd(req, res);
});

cartRouter.post('/',requireJwtAuth, (req: Request, res: Response): void => {
    shoppingCartController.add(req, res);
});

cartRouter.put('/:id',requireJwtAuth, (req:Request, res: Response): void => {
    shoppingCartController.update(req, res);
});

cartRouter.delete('/:id',requireJwtAuth, (req:Request, res: Response): void => {
    shoppingCartController.remove(req, res);    
});

export default cartRouter;