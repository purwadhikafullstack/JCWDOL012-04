'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import CartApi from '@/api/cart.api.withAuth';
import { ShoppingCartModel } from '@/model/ShoppingCartModel';

export type cartContextType = {
    cart: ShoppingCartModel[]; // Replace any with the type of the items in the cart
    setCart: React.Dispatch<React.SetStateAction<ShoppingCartModel[]>>; // Replace any with the type of the items in the cart
  }

const cartContextState = {
    cart: [],
    setCart: () => ''
}
  

export const CartContext = React.createContext<cartContextType>(cartContextState); // Provide a default value for the createContext() method

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ShoppingCartModel[]>([]);

    const cartApi = new CartApi();

    async function getCart() {
        await cartApi.getCart().then((response) => {
            setCart(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getCart();
    },[]);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};