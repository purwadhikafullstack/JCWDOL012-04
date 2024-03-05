import {Response} from 'express';
import ShoppingCartService from '../services/cart.service';

export default async function globalStockCheck(productId:number, quantity:number, res:Response): Promise<boolean>{
    const shoppingCartService = new ShoppingCartService();
    const globalStock = await shoppingCartService.getGlobalStock(productId);
    if (globalStock._sum.stock===null) {
        res.status(404).json({ message: 'Product not found' });
        return false;
    }

    if (globalStock._sum.stock < quantity) {
        res.status(400).json({ message: 'Not enough stock' });
        return false;
    }

    return true;
}