"use client"

import { UserCitiesModel } from "@/model/UserCitiesModel";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/auth.provider";
import { addAddressAction, deleteAddressAction, fetchAddressAction, fetchCities, fetchProvinces, getChoosenAddress, setAsPrimaryAddressAction, updateAddressAction, updateChoosenAddressAction } from "./adress.action";
import { ProvincesModel } from "@/model/ProvincesModel";
import { CitiesModel } from "@/model/CitiesModel";

export type AddressContext = {
    isAvailable: boolean;
    isLoading: boolean;
    userAddress: UserCitiesModel[];
    error: {
        status: number | null | undefined;
        message: string | null | undefined;
    } | null;
    data: {
        provinces: ProvincesModel[],
        cities: CitiesModel[]
    };
    choosenAddress: UserCitiesModel | null;
    updateChosenAddress: (address: UserCitiesModel | null) => void;
    getProvinces: () => void;
    getCities: (provinceId?: number | string) => void;
    addAddress: (values: UserCitiesModel) => void;
    updateAddress: (id: number | string, values: UserCitiesModel) => void;
    setAsPrimary: (id: number | string) => void;
    deleteAddress: (id: number | string) => void;
    clearError: () => void
}

const initialAddressContext = {
    isAvailable: false,
    isLoading: false,
    userAddress: [],
    error: {
        status: undefined,
        message: undefined,
    },
    data: {
        provinces: [],
        cities: []
    },
    choosenAddress: null,
    updateChosenAddress: (address: UserCitiesModel | null) => { },
    getProvinces: () => { },
    getCities: (provinceId?: number | string) => { },
    addAddress: (values: UserCitiesModel) => { },
    updateAddress: (id: number | string, values: UserCitiesModel) => { },
    setAsPrimary: (id: number | string) => { },
    deleteAddress: (id: number | string) => { },
    clearError: () => { }
}

const AddressContext = createContext<AddressContext>(initialAddressContext);

export default function AddressProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState<AddressContext['isLoading']>(true);
    const [error, setError] = useState<AddressContext['error']>(initialAddressContext.error);
    const [userAddress, setAddress] = useState<AddressContext['userAddress']>(initialAddressContext.userAddress);
    const [provinces, setProvinces] = useState<AddressContext['data']['provinces']>(initialAddressContext.data.provinces);
    const [cities, setCities] = useState<AddressContext['data']['cities']>(initialAddressContext.data.cities);
    const primaryAddress = userAddress.filter((address) => address.isPrimaryAddress && !address.archieved)[0]
    const [choosenAddress, setChoosenAddress] = useState<AddressContext['choosenAddress']>(initialAddressContext.choosenAddress);
    const [isAvailable, setIsAvailable] = useState<AddressContext['isAvailable']>(false);
    const auth = useAuth()
    const user = auth?.user

    useEffect(() => {
        if (auth?.user.isAuthenticated) {
            fetchAddress()
        };
    }, [user?.isAuthenticated])

    useEffect(() => {
        getChoosenAddress(primaryAddress, setChoosenAddress)
    }, [primaryAddress])

    useEffect(() => {
        if (!isAvailable) setIsAvailable(true)
        setIsLoading(false);
    }, [])

    const fetchAddress = async () => {
        setIsLoading(true);
        await fetchAddressAction(user?.data?.id!, setAddress, setError);
        setIsLoading(false);
    }

    const addAddress = async (values: UserCitiesModel) => {
        setIsLoading(true);
        addAddressAction(values, setAddress, setError);
        setIsLoading(false)
    }

    const updateAddress: AddressContext['updateAddress'] = async (id, values) => {
        setIsLoading(true);
        updateAddressAction(id, values, setAddress, setError);
        setIsLoading(false)
    }

    const deleteAddress = async (id: number | string) => {
        setIsLoading(true);
        deleteAddressAction(id, setAddress, setError);
        setIsLoading(false);
    }

    const setAsPrimary = async (id: number | string) => {
        setIsLoading(true);
        setAsPrimaryAddressAction(id, setAddress, setError);
        setIsLoading(false)
    }

    const updateChosenAddress: AddressContext['updateChosenAddress'] = (address) => {
        updateChoosenAddressAction(address, setChoosenAddress);
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

    const clearError = () => {
        setError({ status: null, message: null })
    }

    return (
        <AddressContext.Provider value={{
            isAvailable,
            isLoading,
            userAddress,
            error: {
                status: error?.status,
                message: error?.message,
            },
            data: { provinces, cities },
            choosenAddress,
            updateChosenAddress,
            addAddress,
            updateAddress,
            setAsPrimary,
            deleteAddress,
            getProvinces,
            getCities,
            clearError
        }}>
            {children}
        </AddressContext.Provider>
    )
}

export function useAddress() {
    return useContext(AddressContext);
}