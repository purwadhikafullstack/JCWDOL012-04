"use client"

import { UserCitiesModel } from "@/model/UserCitiesModel";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/auth.provider";
import { addAddressAction, deleteAddressAction, fetchAddressAction, fetchCities, fetchProvinces, setAsPrimaryAddressAction, updateAddressAction } from "./adress.action";
import { ProvincesModel } from "@/model/ProvincesModel";
import { CitiesModel } from "@/model/CitiesModel";

export type AddressContext = {
    isLoading: boolean;
    userAddress: UserCitiesModel[];
    error: {
        status: number | null | undefined;
        message: string | null | undefined;
    };
    data: {
        provinces: ProvincesModel[],
        cities: CitiesModel[]
    };
    getProvinces: () => void;
    getCities: (provinceId?: number | string) => void;
    addAddress: (values: UserCitiesModel) => void;
    updateAddress: (id: number | string, values: UserCitiesModel) => void;
    setAsPrimary: (id: number | string) => void;
    deleteAddress: (id: number | string) => void;
}

const initialAddressContext = {
    isLoading: false,
    userAddress: [],
    error: {
        status: undefined,
        message: undefined
    },
    data: {
        provinces: [],
        cities: []
    },
    getProvinces: () => { },
    getCities: (provinceId?: number | string) => { },
    addAddress: (values: UserCitiesModel) => { },
    updateAddress: (id: number | string, values: UserCitiesModel) => { },
    setAsPrimary: (id: number | string) => { },
    deleteAddress: (id: number | string) => { }
}

const AddressContext = createContext<AddressContext>(initialAddressContext);

export default function AddressProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AddressContext['error']>(initialAddressContext.error);
    const [userAddress, setAddress] = useState<UserCitiesModel[]>(initialAddressContext.userAddress);
    const [provinces, setProvinces] = useState<ProvincesModel[]>(initialAddressContext.data.provinces);
    const [cities, setCities] = useState<CitiesModel[]>(initialAddressContext.data.cities);

    const auth = useAuth()
    const user = auth?.user

    useEffect(() => { auth?.user.isAuthenticated && fetchAddress(); }, [user?.isAuthenticated])

    const fetchAddress = async () => {
        setIsLoading(true);
        await fetchAddressAction(user?.data?.id!, setAddress, setError);
        setIsLoading(false);
    }

    const addAddress = async (values: UserCitiesModel) => {
        setIsLoading(true);
        addAddressAction(values, setAddress, setError);
    }

    const updateAddress: AddressContext['updateAddress'] = async (id, values) => {
        setIsLoading(true);
        updateAddressAction(id, values, setAddress, setError);
    }

    const deleteAddress = async (id: number | string) => {
        setIsLoading(true);
        deleteAddressAction(id, setAddress, setError);
        setIsLoading(false);
    }

    const setAsPrimary = async (id: number | string) => {
        setIsLoading(true);
        setAsPrimaryAddressAction(id, setAddress, setError);
    }

    const getProvinces: AddressContext['getProvinces'] = async () => {
        setIsLoading(true);
        await fetchProvinces(setProvinces, setError);
        setIsLoading(false);
    }

    const getCities: AddressContext['getCities'] = async (provinceId?) => {
        setIsLoading(true);
        await fetchCities(setCities, setError, provinceId);
        setIsLoading(false);
    }

    return (
        <AddressContext.Provider value={{ isLoading, userAddress, error, data: { provinces, cities }, addAddress, updateAddress, setAsPrimary, deleteAddress, getProvinces, getCities }}>
            {children}
        </AddressContext.Provider>
    )
}

export function useAddress() {
    return useContext(AddressContext);
}