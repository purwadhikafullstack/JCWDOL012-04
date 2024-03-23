"use client"

import { WarehousesModel } from "@/model/WarehousesModel";
import { createContext, useContext, useEffect, useState } from "react";
import { useAddress } from "../address/address.provider";
import { getClosestWarehouseAction, getShippingMethodAction } from "./shipping.action";

export type ShippingContext = {
    isAvailable: boolean;
    isLoading: boolean;
    error: {
        status: number | null | undefined;
        message: string | null | undefined;
    };
    shippingCost: number | null;
    shippingMethod: RajaOngkirCostResults[] | null;
    chosenShippingMethod: RajaOngkirCostResults['costs'][0] & { courier: string } | null;
    closestWarehouse: WarehousesModel | null;
    getShippingMethod: (weight?: number) => void;
    set: {
        chosenShippingMethod: (method: ShippingContext['chosenShippingMethod']) => void;
        shippingCost: (cost: number) => void;
    }
}

const initialShippingContext = {
    isAvailable: false,
    isLoading: false,
    error: {
        status: undefined,
        message: undefined
    },
    shippingCost: null,
    shippingMethod: null,
    chosenShippingMethod: null,
    closestWarehouse: null,
    getShippingMethod: () => { },
    set: {
        chosenShippingMethod: () => { },
        shippingCost: () => { }
    }
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
    const address = useAddress();
    const chosenShippingAddress = address.userAddress.find((userAddress) => userAddress.id === address.choosenAddress?.id);
    const [isAvailable, setIsAvailable] = useState<ShippingContext['isAvailable']>(false);

    useEffect(() => {
        if (!isAvailable) setIsAvailable(true)
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (address.choosenAddress?.id && chosenShippingAddress) {
            setIsLoading(true);
            getClosestWarehouseAction(chosenShippingAddress!, setClosestWarehouse, setError);
            setIsLoading(false);
        } else {
            setClosestWarehouse(null);
        }
    }, [address.choosenAddress]);

    useEffect(() => {
        setShippingCost(null);
        setChosenShippingMethod(null);
    }, [address.choosenAddress]);


    const getShippingMethod: ShippingContext['getShippingMethod'] = async (weight?) => {
        setIsLoading(true);
        await getShippingMethodAction(chosenShippingAddress!, closestWarehouse, setShippingMethod, setError, weight);
        setIsLoading(false);
    }

    const provide = {
        isAvailable,
        isLoading,
        error,
        shippingCost,
        shippingMethod,
        chosenShippingMethod,
        closestWarehouse,
        getShippingMethod,
        set: {
            chosenShippingMethod: setChosenShippingMethod,
            shippingCost: setShippingCost
        }
    }

    return (
        <ShippingContext.Provider value={provide}>
            {children}
        </ShippingContext.Provider>
    )
}

export function useShipping() {
    return useContext(ShippingContext);
}