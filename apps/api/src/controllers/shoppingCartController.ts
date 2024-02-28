import { Request,Response } from 'express';
import ShoppingCartService from '../services/shoppingCartService';
import { PrismaClient } from '@prisma/client';

export default class ShoppingCartController {
    prisma: PrismaClient;
    shoppingCartService: ShoppingCartService;
    user: any;
    constructor(){
        this.prisma = new PrismaClient();
        this.shoppingCartService = new ShoppingCartService();

        //simulating user login
        this.user = {
            id:1,
            firstName: 'customer1',
            lastName: 'lastName1',
            email: 'email1@bata.com',
            role: 'CUSTOMER',
            isVerified: true
        };
    }

    accCheck(user:any, res:Response): boolean{
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return false;
        }else if (user.role !== 'CUSTOMER' || !user.isVerified) {
            res.status(403).json({ message: 'Forbidden' });
            return false;
        }
        return true;
    }
    
    async globalStockCheck(productId:number, quantity:number, res:Response): Promise<boolean>{
        const globalStock = await this.shoppingCartService.getGlobalStock(productId);
        if (!globalStock._sum.stock) {
            res.status(404).json({ message: 'Product not found' });
            return false;
        }
    
        if (globalStock._sum.stock < quantity) {
            res.status(400).json({ message: 'Not enough stock' });
            return false;
        }

        return true;
    }
    
    async shoppingCartCheck(shoppingCartId:number, user:any, req:Request, res:Response): Promise<boolean>{
        const shoppingCart = await this.shoppingCartService.getById(shoppingCartId);

        if (!shoppingCart) {
            res.status(404).json({ message: 'Item not found' });
            return false;
        }
        if (shoppingCart.userId !== user.id) {
            res.status(403).json({ message: 'Forbidden' });
            return  false;
        }

        return true;
    }

    async productCheck(productId:number, res:Response): Promise<boolean>{
        const product = await this.prisma.products.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return false;
        }
        return true;
    }

    async get(req:Request, res:Response): Promise<void>{
        const user = this.user;
        const check = this.accCheck(user, res);
        if(check === false) return;
        
        const shoppingCart = await this.shoppingCartService.getByUserId(user.id);
        res.status(200).json(shoppingCart);
    }

    async add(req:Request, res:Response): Promise<void>{
        const user = this.user;
        if(!(await this.accCheck(user, res))) return;
        const { productId, quantity } = req.body;
        if(!(await this.productCheck(productId, res))) return;
        if(!(await this.globalStockCheck(productId, quantity, res))) return;
        const shoppingCart = await this.shoppingCartService.getByIdFirst(productId);
        if (shoppingCart) {
            await this.shoppingCartService.update(shoppingCart.id, { quantity: shoppingCart.quantity + quantity });
        } else {
            await this.shoppingCartService.add({ userId: user.id, productId: productId, quantity: quantity });
        }
        res.status(200).json({ message: 'Added to cart' });
    }

    async update(req:Request, res:Response): Promise<void>{
        const user = this.user;
        if(!(await this.accCheck(user, res))) return;
        const shoppingCartId = parseInt(req.params.id);
        if(!(await this.shoppingCartCheck(shoppingCartId, user, req, res))) return;
        const { quantity } = req.body;
        if(!(await this.globalStockCheck(shoppingCartId, quantity, res))) return;
        await this.shoppingCartService.update(shoppingCartId, { quantity: quantity });
        res.status(200).json({ message: 'Cart updated' });
    }

    async remove(req:Request, res:Response): Promise<void>{
        const user = this.user;
        if(!(await this.accCheck(user, res))) return;
        const shoppingCartId = parseInt(req.params.id);
        if(!(await this.shoppingCartCheck(shoppingCartId, user, req, res))) return;
        await this.shoppingCartService.remove(shoppingCartId);
        res.status(200).json({ message: 'Item removed' });
    }

    // //not finished
    // async checkout(req:Request, res:Response): Promise<void>{
    //     const user = this.user;
    //     if(!(await this.accCheck(user, res))) return;
    //     const shoppingCart = await this.shoppingCartService.getByUserId(user.id);
    //     if(shoppingCart.length === 0){
    //         res.status(400).json({ message: 'Cart is empty' });
    //         return;
    //     }
    //     await this.shoppingCartService.checkout(user.id);
    //     res.status(200).json({ message: 'Checkout successful' });
    // }
}