import { Request,Response } from 'express';
import CartService from '../services/cart.service';
import { Users } from '@prisma/client';
import globalStockCheck from '../lib/globalStock.check';
import productCheck from '../lib/product.check';
import cartCheck from '../lib/cart.check';

export default class CartController {
    CartService: CartService;
    user: any;
    constructor(){
        this.CartService = new CartService();
    }

    async get(req:Request, res:Response): Promise<void>{
        const user:any = req.user;
        
        const Cart = await this.CartService.getByUserId(user.id);
        res.status(200).json(Cart);
    }

    async preAdd(req:Request, res:Response): Promise<void>{
        const user:any = req.user;
        const productId = parseInt(req.params.productId);
        if(!(await productCheck(productId, res))) return;
        const product = await this.CartService.preAdd(productId);
        const stock = await this.CartService.getGlobalStock(productId).then((stock:any) => {return stock._sum.stock});
        res.status(200).json({ product, stock});
    }

    async add(req:Request, res:Response): Promise<void>{
        const user:any = req.user;
        const { productId, quantity } = req.body;
        if(!(await productCheck(productId, res))) return;
        if(!(await globalStockCheck(productId, quantity, res))) return;
        const cart = await this.CartService.getByUserIdProductIdFirst(user.id, productId);
        if (cart!=null) {
            await this.CartService.update(cart.id, { quantity: cart.quantity + quantity });
        } else {
            await this.CartService.add({ userId: user.id, productId: productId, quantity: quantity });
        }
        res.status(200).json({ message: `Added to cart productId=${productId} quantity=${quantity} cart=${JSON.stringify(cart)}` });
    }

    async update(req:Request, res:Response): Promise<void>{
        const user:any = req.user;
        const CartId = parseInt(req.params.id);
        if(!(await cartCheck(CartId, user, req, res))) return;
        const { quantity } = req.body;
        const productId = (await this.CartService.getById(CartId)).productId;
        if(!(await productCheck(productId, res))) return;
        if(!(await globalStockCheck(productId, quantity, res))) return;
        await this.CartService.update(CartId, { quantity: quantity });
        res.status(200).json({ message: 'Cart updated' });
    }

    async remove(req:Request, res:Response): Promise<void>{
        const user:any = req.user;
        const CartId = parseInt(req.params.id);
        if(!(await cartCheck(CartId, user, req, res))) return;
        await this.CartService.remove(CartId);
        res.status(200).json({ message: 'Item removed' });
    }
}