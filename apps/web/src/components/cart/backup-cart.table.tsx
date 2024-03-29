'use client'
import { useEffect, useState, useRef } from "react";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import Errors from "@/app/errors";
import { debounce } from "lodash";
import { useUpdateCart } from "@/lib/cart.provider.update";
import {toast, ToastContainer} from 'react-toastify';

import CartApi from "@/api/cart.api.withAuth";
import idr from "@/lib/idrCurrency";

export default function CartTable() {
    const updateCartContext = useUpdateCart();
    const [cart, setCart] = useState<ShoppingCartModel[]>([]);
    const [status, setStatus] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [update, setUpdate] = useState<{ id: number, quantity: number }>({ id: -1, quantity: -1 });
    const [loading, setLoading] = useState<boolean>(true);

    const cartApi = new CartApi();

    const debounceHandleInputChange = debounce(handleInputChange, 1000);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, item: ShoppingCartModel) {
        setUpdate({ id: item.id, quantity: parseInt(event.target.value) });
    }

    useEffect(() => {
        if (update.id !== -1 && update.quantity !== -1) {
            handleUpdate(update);
        }
        updateCart();
    }, [update]);

    async function handleUpdate(update: { id: number, quantity: number }) {
        console.log('handleUpdate called with quantity:', update.quantity);
        const id = update.id;
        const quantity = update.quantity;
        if (quantity) {
            if (!isNaN(quantity) && quantity > 0) {
                await cartApi.updateCartItem(id, quantity).then((response) => {
                    setLoading(true);
                    if (response.status === 200) {
                        setLoading(false);
                        updateCart();
                    }
                }
                ).catch((error) => {
                    setStatus(error.status);
                    setError(error.message);
                    console.log(error);
                })
            }
        }
    }

    async function updateCart() {
        await cartApi.getCart().then((response) => {
            setLoading(true);
            setStatus(response.status);
            if (response.status === 200) {
                setCart(response.data);
                updateCartContext();
                setLoading(false);
            }
        }).catch((error) => {
            setStatus(error.status);
            setError(error.message);
            console.log(error);
        });
    }

    useEffect(() => {
        updateCart();
    }, [loading]);


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
            <ToastContainer />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-white bg-[var(--primaryColor)]">Product Name</th>
                        <th className="px-6 py-3 text-white bg-[var(--primaryColor)]">Quantity</th>
                        <th className="px-6 py-3 text-white bg-[var(--primaryColor)]">@Price</th>
                        <th className="px-6 py-3 text-white bg-[var(--primaryColor)]">Price</th>
                        <th className="px-6 py-3 text-white bg-[var(--primaryColor)]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => {
                        return (
                            <tr key={item.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4">{item.product?.name}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <input
                                            key={item.quantity}
                                            id="quantityUpdate"
                                            type="number"
                                            min="1"
                                            className="px-2 py-1 border rounded-md max-w-[5rem]"
                                            defaultValue={item.quantity}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { if (parseInt(event.target.value) !== item.quantity) { debounceHandleInputChange(event, item) } }}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">{idr(item.product?.price ?? 0)}</td>
                                <td className="px-6 py-4" key={item.product?.price}>{idr((item.product?.price ?? 0) * item.quantity)}</td>
                                <td className="px-6 py-4 flex gap-2">

                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mx-1" onClick={
                                        async (event) => {
                                            event.preventDefault();
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                await cartApi.deleteCartItem(item.id).then((response)=>{if(response.status===200){toast.success("Item Deleted")}}); setCart(cart.filter(itemTemp => itemTemp.id !== item.id)); updateCartContext(); 
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
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
