'use client'
import ShippingSummary from "@/components/cart/shipping/shipping.summary"
import ShippingProducts from "@/components/cart/shipping/shipping.products"
import { CartContext } from '@/lib/cart.provider';
import { useContext } from "react";
import { ShoppingCartModel } from '@/model/ShoppingCartModel';

export default function Shipment(){
    const { cart } = useContext(CartContext);
    const cartData: ShoppingCartModel[] = Array.isArray(cart) ? cart : [];

    let total = 0;
    const shippingCost = 10000; // dummy shipping cost
    const closestWarehouseId = 4; // dummy closest warehouse id

    cartData.forEach((item) => {
        total += (item.product?.price ?? 0) * item.quantity;
    });

    return (
        <div className="bg-gray-200">
        <div className="m-auto px-[20px] pt-[24px] pb-[80px] lg:min-h[200px] lg:min-w-[1024px] lg:max-w-[1240px]">
            <h1 className="text-2xl leading-relaxed font-extrabold mb-[24px]">Shipment</h1>
            <div className="relative flex items-start gap-[24px] box-border text-sm">
                <div className="lg:w-[calc(100%-384px)] box-border">
                    <p>shipping address</p>
                    <ShippingProducts cart={cartData} total={total} />
                </div>
                
            <ShippingSummary subtotal={total} shippingCost={shippingCost} cartData={cartData} closestWarehouseId={closestWarehouseId}/>
            </div>
        </div>
    </div>
    )
}