import express, { Request, Response, Router, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const cartRouter = Router();


cartRouter.get('/cart', async (req:Request, res: Response): Promise<void> => {
    const user = {                  //simulating user login
        id:1,
        firstName: 'customer1',
        lastName: 'lastName1',
        email: 'email1@bata.com',
        role: 'CUSTOMER',
        isVerified: true
    };


    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    if(!user.isVerified){
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    
    const shoppingCart = await prisma.shoppingCart.findMany({
        where: {
            userId: user.id
        }
    });

    res.status(200).json(shoppingCart);
});

cartRouter.post('/cart', async (req:Request, res: Response): Promise<void> => {
    const user = {                  //simulating user login
        id:1,
        firstName: 'customer1',
        lastName: 'lastName1',
        email: 'email1@bata.com',
        role: 'CUSTOMER',
        isVerified: true
    };

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    if(!user.isVerified){
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

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
    const user = {                  //simulating user login
        id:1,
        firstName: 'customer1',
        lastName: 'lastName1',
        email: 'email1@bata.com',
        role: 'CUSTOMER',
        isVerified: true
    };

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    if(!user.isVerified){
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    const { id } = req.params;
    const { quantity } = req.body;
    const shoppingCart = await prisma.shoppingCart.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!shoppingCart) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }
    if (shoppingCart.userId !== user.id) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

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
    const user = {                  //simulating user login
        id:1,
        firstName: 'customer1',
        lastName: 'lastName1',
        email: 'email1@bata.com',
        role: 'CUSTOMER',
        isVerified: true
    };

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    if (user.role !== 'CUSTOMER') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    if(!user.isVerified){
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    const { id } = req.params;
    const shoppingCart = await prisma.shoppingCart.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!shoppingCart) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }

    if (shoppingCart.userId !== user.id) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }

    await prisma.shoppingCart.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.status(200).json({ message: 'Item removed from cart' });
});