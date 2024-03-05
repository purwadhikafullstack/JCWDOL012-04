'use client';
import React, { useContext } from 'react';
import { CartContext } from '@/lib/cart.provider';
import { ShoppingCartModel } from '@/model/ShoppingCartModel';
import Link from 'next/link';
import Image from 'next/image';

export default function CartIcon() {
    const { cart } = useContext(CartContext);
    const total = cart.reduce((acc: number, item: ShoppingCartModel) => acc + item.quantity, 0);
    return (
        <Link className='flex relative w-[40px] m-2 hover:bg-slate-300 p-2 rounded-xl' href="/cart">
            <Image src="/images/cart.png" alt="cart" width={24} height={24} />
            <span className='bg-red-500 text-sm rounded-xl text-white w-fit px-2 font-bold absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2'>{total}</span>
        </Link>
    );
}