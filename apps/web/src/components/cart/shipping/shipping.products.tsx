'use client'
import { useEffect, useState } from "react";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { ProductsModel } from "@/model/ProductsModel";
import Errors from "@/app/errors";
import { useUpdateCart } from "@/lib/cart.provider.update";
import { ToastContainer } from 'react-toastify';
import ImagePlaceholder from "../../image.placeholder";

import CartApi from "@/api/cart.api.withAuth";
import idr from "@/lib/idrCurrency";

export default function ShippingProducts({cart=[], total=0}:{cart: ShoppingCartModel[], total:number}) {
    const updateCartContext = useUpdateCart();
    const [status, setStatus] = useState<number>(0);
    const [error, setError] = useState<string>("");


    if (cart.length === 0) {
        return (
            <div>
                <h1>Your cart is empty</h1>
            </div>
        )
    }
    
    function getPrimaryImagePath(product?: ProductsModel) {
        const productImage = product?.productImages ?? [];
        const primaryImagePath = (productImage.length > 0 ? productImage[0]?.path : '/asdf');
        return primaryImagePath;
    }

    return (
        <div className="bg-white rounded-xl">
            <ToastContainer />
            <div className="lg:max-w-[1080px] rounded-lg p-10">
                {cart.map((item) => {
                    return (
                        <div key={item.id} className="flex gap-2 py-5 m-2 border-b-2 border-[var(--primaryColor)]">
                            <div className="flex mr-auto">
                                <ImagePlaceholder primaryImagePath={getPrimaryImagePath(item.product)} alt={`${item.id}`} />
                                <p className="px-6 py-4">{item.product?.name}</p>
                            </div>
                            <div className="ml-auto flex-col" >
                                <div className="flex items-center">
                                    <p className="mr-2 font-semibold">x {item.quantity}</p>
                                    <p className="py-4 font-semibold ml-auto">@{idr(item.product?.price ?? 0)}</p>
                                </div>
                                <div className="flex">
                                    <p className="font-bold text-lg flex" key={item.product?.price}>{idr((item.product?.price ?? 0) * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                
                <p className="px-6 py-4 text-xl font-bold">Subtotal</p>
                <p className="px-6 text-xl font-bold">{idr(total)}</p>
            </div>
        </div>
    )
}


