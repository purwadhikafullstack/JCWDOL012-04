'use client'
import { useEffect, useState } from "react";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import Errors from "@/app/errors";

import Router from "next/router";
import CartApi from "@/api/cartApi";
import idr from "@/lib/idrCurrency";
import { set } from "cypress/types/lodash";

export default function CartTable() {
    const [cart, setCart] = useState<ShoppingCartModel[]>([]);
    const [status, setStatus] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const cartApi = new CartApi();

    useEffect(() => {
        cartApi.getCart().then((response) => {
            setStatus(response.status);
            if (response.status === 200) {
                setCart(response.data);
                setLoading(false);
            }
        }
        ).catch((error) => {
            setStatus(error.status);
            setError(error.message);
            console.log(error);
        })
    }, []);


    let total = 0;

    cart.map((item) => {
        const price = item.product?.price ?? 0;
        total += item.quantity * price;
    });

    if (status && status !== 200) {
        return <Errors statusCode={status} message={error} />
    }

    if (!loading && cart.length === 0) {
        return (
            <div>
                <h1>Your cart is empty</h1>
            </div>
        )
    }
    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

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
                                <td className="px-6 py-4">{idr(item.product?.price ?? 0)}</td>
                                <td className="px-6 py-4">{idr((item.product?.price ?? 0) * item.quantity)}</td>
                                <td className="px-6 py-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-1">Edit</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mx-1" onClick={
                                        async (event) => {
                                            event.preventDefault();
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                await cartApi.deleteCartItem(item.id); setCart(cart.filter(itemTemp => itemTemp.id !== item.id))
                                            }
                                        }}
                                    >Remove</button>

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
