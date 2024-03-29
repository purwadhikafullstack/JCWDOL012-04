'use client'
import { useEffect } from "react";
import ShippingMethod from "@/components/shipping/shipping-method";
import { WarehousesModel } from "@/model/WarehousesModel";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import { useShipping } from "@/lib/store/shipping/shipping.provider";
import { useAddress } from "@/lib/store/address/address.provider";

type params = {
    totalWeight: number;
    setClosestWarehouse: React.Dispatch<React.SetStateAction<WarehousesModel>>;
    setShippingAddress: React.Dispatch<React.SetStateAction<UserCitiesModel>>;
    setShippingCost: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShipmentWrapped(params: params) {
    let closestWarehouse = useShipping().closestWarehouse;
    let shippingCost = useShipping().shippingCost;
    let shippingAddress = useAddress().choosenAddress;

    useEffect(() => {
        if(closestWarehouse) {params.setClosestWarehouse(closestWarehouse);}
        if(shippingAddress) {params.setShippingAddress(shippingAddress);}
        if(shippingCost) {params.setShippingCost(shippingCost);}
    }, [useShipping().closestWarehouse, useShipping().shippingCost, useAddress().choosenAddress]);
    return (
        <ShippingMethod totalWeight={params.totalWeight} />
    )
}