"use client"

import { WarehousesModel } from "@/model/WarehousesModel";
import { createContext, useContext, useEffect, useState } from "react";

export type ShippingContext = {
    isLoading: boolean;
    error: {
        status: number | null | undefined;
        message: string | null | undefined;
    };
    shippingCost: number | null;
    shippingMethod: RajaOngkirCostResults | null;
    chosenShippingMethod: RajaOngkirCostResults | null;
    closestWarehouse: WarehousesModel | null;
}

const initialShippingContext = {
    isLoading: false,
    error: {
        status: undefined,
        message: undefined
    },
    shippingCost: null,
    shippingMethod: null,
    chosenShippingMethod: null,
    closestWarehouse: null
}

const ShippingContext = createContext<ShippingContext>(initialShippingContext);

export default function ShippingProvider(
    { children }: { children: React.ReactNode }
) {
    const [isLoading, setIsLoading] = useState<ShippingContext['isLoading']>(true);
    const [error, setError] = useState<ShippingContext['error']>(initialShippingContext.error);
    const [shippingCost, setShippingCost] = useState<ShippingContext['shippingCost']>(initialShippingContext.shippingCost);
    const [shippingMethod, setShippingMethod] = useState<ShippingContext['shippingMethod']>(initialShippingContext.shippingMethod);
    const [chosenShippingMethod, setChosenShippingMethod] = useState<ShippingContext['chosenShippingMethod']>(initialShippingContext.chosenShippingMethod);
    const [closestWarehouse, setClosestWarehouse] = useState<ShippingContext['closestWarehouse']>(initialShippingContext.closestWarehouse);


    const value = {
        isLoading,
        error,
        shippingCost,
        shippingMethod,
        chosenShippingMethod,
        closestWarehouse
    }

    return (
        <ShippingContext.Provider value={value}>
            {children}
        </ShippingContext.Provider>
    )
}
