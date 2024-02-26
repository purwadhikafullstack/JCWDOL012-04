import express, { Request, Response, Router, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const cartRouter = Router();

//simulating user login
const user = {
    id:1,firstName: 'customer1',
    lastName: 'lastName1',
    email: 'email1@bata.com',
    role: 'CUSTOMER',
    isVerified: true
};

function accCheck(user:any, res:Response){
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return '-1';
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return '-1';
    }
    if(!user.isVerified){
        res.status(403).json({ message: 'Forbidden' });
        return '-1';
    }
}

async function globalStockCheck(prductId:number, quantity:number, res:Response){
    const globalStock = await prisma.productsWarehouses.aggregate({
        _sum: {
            stock: true
        },
        where: {
            productId: prductId
        },
    });
    if (!globalStock._sum.stock) {
        res.status(404).json({ message: 'Product not found' });
        return '-1';
    }

    if (globalStock._sum.stock < quantity) {
        res.status(400).json({ message: 'Not enough stock' });
        return '-1';
    }
}

async function shoppingCartCheck(shoppingCartId:number, res:Response){
    const shoppingCart = await prisma.shoppingCart.findUnique({
        where: {
            id: shoppingCartId
        }
    });
    if (!shoppingCart) {
        res.status(404).json({ message: 'Item not found' });
        return '-1';
    }
    if (shoppingCart.userId !== user.id) {
        res.status(403).json({ message: 'Forbidden' });
        return '-1';
    }
}

cartRouter.get('/cart', async (req:Request, res: Response): Promise<void> => {
    const check = accCheck(user, res);
    if(check === '-1') return;
    
    const shoppingCart = await prisma.shoppingCart.findMany({
        where: {
            userId: user.id
        }
    });

    res.status(200).json(shoppingCart);
});

cartRouter.post('/cart', async (req:Request, res: Response): Promise<void> => {
    const check = accCheck(user, res);
    if(check === '-1') return;

    const { productId, quantity } = req.body;
    const product = await prisma.products.findUnique({
        where: {
            id: productId
        }
    });

    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }

    const checkStock = await globalStockCheck(productId, quantity, res);
    if(checkStock === '-1') return;

    const shoppingCart = await prisma.shoppingCart.findFirst({
        where: {
            userId: user.id,
            productId: productId
        }
    });

    if (shoppingCart) {
        await prisma.shoppingCart.update({
            where: {
                id: shoppingCart.id
            },
            data: {
                quantity: shoppingCart.quantity + quantity
            }
        });
    } else {
        await prisma.shoppingCart.create({
            data: {
                userId: user.id,
                productId: productId,
                quantity: quantity
            }
        });
    }

    res.status(201).json({ message: 'Product added to cart' });
});

cartRouter.put('/cart/:id', async (req:Request, res: Response): Promise<void> => {
    const check = accCheck(user, res);
    if(check === '-1') return;
    const { id } = req.params;
    const { quantity } = req.body;
    shoppingCartCheck(parseInt(id), res);
    if(check === '-1') return;
    await prisma.shoppingCart.update({
        where: {
            id: parseInt(id)
        },
        data: {
            quantity: quantity
        }
    });
    res.status(200).json({ message: 'Cart updated' });
});

cartRouter.delete('/cart/:id', async (req:Request, res: Response): Promise<void> => {
    const check = accCheck(user, res);
    if(check === '-1') return;
    const { id } = req.params;
    shoppingCartCheck(parseInt(id), res);
    if(check === '-1') return;
    await prisma.shoppingCart.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.status(200).json({ message: 'Item removed from cart' });
});

export default cartRouter;