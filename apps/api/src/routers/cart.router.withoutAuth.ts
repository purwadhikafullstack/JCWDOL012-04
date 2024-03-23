import { Request, Response, Router } from "express";
import ShoppingCartController from '../controllers/cart.controller.withAuth';

const cartRouter = Router();
const shoppingCartController = new ShoppingCartController();

cartRouter.get('/', (req: Request, res: Response): void => {
    shoppingCartController.get(req, res);
});

cartRouter.get('/preAdd/:productId', (req: Request, res: Response): void => {
    shoppingCartController.preAdd(req, res);
});

cartRouter.post('/', (req: Request, res: Response): void => {
    shoppingCartController.add(req, res);
});

cartRouter.put('/:id', (req:Request, res: Response): void => {
    shoppingCartController.update(req, res);
});

cartRouter.delete('/:id', (req:Request, res: Response): void => {
    shoppingCartController.remove(req, res);    
});

export default cartRouter;