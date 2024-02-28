'use client'
import { useEffect, useState } from "react";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import idr from "@/lib/idrCurrency";

interface CartTableProps {
    cartData: ShoppingCartModel[];
    editCart: (id: number, quantity: number) => Promise<boolean>;
    deleteCartItem: (id: number) => Promise<boolean>;
}

export default function CartTable({cartData, editCart, deleteCartItem}: CartTableProps) {
    const [cart, setCart] = useState<ShoppingCartModel[]>([]);
    
    useEffect(() => {
        setCart(cartData);
    }, [cart]);

    let total = 0;

    cart.map((item) => {
        const price = item.product?.price?? 0;
        total += item.quantity * price;
    });

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:mx-20">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th className="px-6 py-3">Product Name</th>
                        <th className="px-6 py-3">Quantity</th>
                        <th className="px-6 py-3">@Price</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => {
                        return (
                            <tr key={item.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4">{item.product?.name}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{idr(item.product?.price??0)}</td>
                                <td className="px-6 py-4">{idr((item.product?.price??0)*item.quantity)}</td>
                                <td className="px-6 py-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-1">Edit</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mx-1" onClick={async (event) => { event.preventDefault(); await deleteCartItem(item.id); }}>Remove</button>
                                </td>
                            </tr>
                        )
                    })}
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="px-6 py-4">Total</td>
                        <td className="px-6 py-4">{idr(total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}