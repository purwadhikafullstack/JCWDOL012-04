import { Request, Response } from "express";
import CartService from "../services/cart.service";

export default async function cartCheck(CartId:number, user:any, req:Request, res:Response): Promise<boolean>{
    const cartService = new CartService();
    const Cart = await cartService.getById(CartId);

    if (Cart.userId !== user.id) {
        res.status(403).json({ message: 'Forbidden' });
        return  false;
    }

    return true;
}