'use client'
import { useEffect, useState, useRef } from "react";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { ProductImagesModel } from "@/model/ProductImagesModel";
import { ProductsModel } from "@/model/ProductsModel";
import Errors from "@/app/errors";
import { debounce } from "lodash";
import { useUpdateCart } from "@/lib/cart.provider.update";
import { toast, ToastContainer } from 'react-toastify';
import ImagePlaceholder from "../image.placeholder";
import Image from "next/image";

import CartApi from "@/api/cart.api";
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
        const id = update.id;
        const quantity = update.quantity;
        console.log('handleUpdate called with quantity:', update.quantity, 'id', id);
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

    function getPrimaryImagePath(product?: ProductsModel) {
        const productImage = product?.productImages ?? [];
        const primaryImagePath = (productImage.length > 0 ? productImage[0]?.path : '/asdf');
        return primaryImagePath;
    }

    return (
        <div className="my-10">
            <ToastContainer />
            <div className="lg:max-w-[1080px] bg-gray-100 rounded-lg p-10">
                {cart.map((item) => {
                    return (
                        <div key={item.id} className="flex gap-2 py-5 m-2 border-b-2 border-[var(--primaryColor)]">
                            <div className="flex mr-auto">
                                <ImagePlaceholder primaryImagePath={getPrimaryImagePath(item.product)} alt={`${item.id}`} />
                                <p className="px-6 py-4">{item.product?.name}</p>
                            </div>
                            <div className="ml-auto flex-col" >
                                <div className="flex">
                                    <p className="py-4 font-semibold ml-auto">@{idr(item.product?.price ?? 0)}</p>
                                </div>
                                <div className="flex">
                                    <button className="text-white px-4 rounded-md mx-1" onClick={
                                        async (event) => {
                                            event.preventDefault();
                                            if (window.confirm('Are you sure you want to delete this item?')) {
                                                await cartApi.deleteCartItem(item.id).then((response) => { if (response.status === 200) { toast.success("Item Deleted") } }); setCart(cart.filter(itemTemp => itemTemp.id !== item.id)); updateCartContext();
                                            }
                                        }}
                                    >
                                        <Image src="/images/trashcan.png" alt="delete" width={24} height={24}/>
                                    </button>
                                    <input
                                        key={item.quantity}
                                        id="quantityUpdate"
                                        type="number"
                                        min="1"
                                        className="px-2 border rounded-md max-w-[4rem] max-h-[2rem] mr-2"
                                        defaultValue={item.quantity}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { if (parseInt(event.target.value) !== item.quantity) { debounceHandleInputChange(event, item) } }}
                                    />
                                    {/* <input
                                            key={item.quantity}
                                            id="quantityUpdate"
                                            type="number"
                                            min="1"
                                            className="px-2 py-1 border rounded-md max-w-[5rem]"
                                            defaultValue={item.quantity}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { if (parseInt(event.target.value) !== item.quantity) { debounceHandleInputChange(event, item) } }}
                                        /> */}
                                    <p className="font-bold text-lg flex" key={item.product?.price}>{idr((item.product?.price ?? 0) * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <p className="px-6 py-4 text-xl font-bold">Total</p>
                <p className="px-6 py-4 text-xl font-bold">{idr(total)}</p>
            </div>
        </div>
    )
}
