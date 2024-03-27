'use client'
import ShippingSummary from "@/components/cart/shipping/shipping.summary"
import ShippingProducts from "@/components/cart/shipping/shipping.products"
import { CartContext } from '@/lib/cart.provider';
import { useContext, useState, useEffect } from "react";
import { ShoppingCartModel } from '@/model/ShoppingCartModel';
import { useAuth } from "@/lib/store/auth/auth.provider";
import ShippingProvider from "@/lib/store/shipping/shipping.provider";
import AddressProvider from "@/lib/store/address/address.provider";
import ShipmentWrapped from "@/components/cart/shipping/shipping.shipment.wrapped";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import { WarehousesModel } from "@/model/WarehousesModel";
import ShippingAddress from "@/components/profile/address/shipping-address";

export default function Shipment() {
    const auth = useAuth();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;
    const [shippingAddress, setShippingAddress] = useState<UserCitiesModel>({} as UserCitiesModel);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [closestWarehouse, setClosestWarehouse] = useState<WarehousesModel>({} as WarehousesModel);
    // shippingCost: number | null;
    // shippingMethod: RajaOngkirCostResults[] | null;
    // chosenShippingMethod: RajaOngkirCostResults['costs'][0] & { courier: string } | null;
    // closestWarehouse: WarehousesModel | null;
    // choosenAddress: UserCitiesModel | null;
    // const isAuthorLoading = auth?.isLoading;

    if (!isAuthenticated || role !== 'CUSTOMER') {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Unauthorized | 401
            </div>
        )
    }

    const { cart } = useContext(CartContext);
    const cartData: ShoppingCartModel[] = Array.isArray(cart) ? cart : [];

    let total = 0;
    let totalWeight = 0;
    const closestWarehouseId = closestWarehouse.id;
    const shippingAddressId = shippingAddress.id ?? -1;
    // const shippingCost = 10000; // dummy shipping cost
    // const closestWarehouseId = 4; // dummy closest warehouse id

    cartData.forEach((item) => {
        total += (item.product?.price ?? 0) * item.quantity;
        totalWeight += (item.product?.weight ?? 0) * item.quantity;
    });

    return (
        <div className="bg-gray-200">
            <div className="m-auto px-[20px] pt-[24px] pb-[80px] lg:min-h[200px] lg:min-w-[1024px] lg:max-w-[1240px]">
                <h1 className="text-2xl leading-relaxed font-extrabold mb-[24px]">Shipment</h1>
                <div className="relative flex items-start gap-[24px] box-border text-sm">
                    <div className="lg:w-[calc(100%-384px)] box-border">
                        <AddressProvider>
                            <ShippingProvider>
                                <ShippingAddress />
                                <ShipmentWrapped totalWeight={totalWeight} setClosestWarehouse={setClosestWarehouse} setShippingAddress={setShippingAddress} setShippingCost={setShippingCost} />
                            </ShippingProvider>
                        </AddressProvider>
                        <div className="mt-2">
                            <ShippingProducts cart={cartData} total={total} />
                        </div>
                    </div>

                    <ShippingSummary subtotal={total} shippingCost={shippingCost} cartData={cartData} closestWarehouseId={closestWarehouseId} shippingAddressId={shippingAddressId} />
                </div>
            </div>
        </div>
    )
}