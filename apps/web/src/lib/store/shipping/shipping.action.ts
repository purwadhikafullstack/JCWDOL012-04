import axios, { AxiosError, AxiosHeaders } from "axios";
import { Dispatch, SetStateAction } from "react";
import { ShippingContext } from "./shipping.provider";
import { AddressContext } from "../address/address.provider";

const BASE_DATA_URL = process.env.NEXT_PUBLIC_BASE_DATA_URL
const BASE_SHIPPING_URL = process.env.NEXT_PUBLIC_BASE_SHIPPING_URL

const data = axios.create({
    baseURL: BASE_DATA_URL,
    withCredentials: true
})

const shipping = axios.create({
    baseURL: BASE_SHIPPING_URL,
    withCredentials: true,
})

export async function getClosestWarehouseAction(
    chosenShippingAddress: AddressContext['choosenAddress'] | null,
    setClosestWarehouse: Dispatch<SetStateAction<ShippingContext['closestWarehouse']>>,
    setError: Dispatch<SetStateAction<ShippingContext['error']>>
) {
    console.log(chosenShippingAddress)
    await data.get('/closest-wh', { params: { lat: chosenShippingAddress?.latitude, lng: chosenShippingAddress?.longitude } })
        .then((response) => {
            console.log(response.data)
            setClosestWarehouse(response.data.data)
        })
        .catch((error) => handleError(error, setError))
}

export async function getShippingMethodAction(
    chosenShippingAddress: AddressContext['choosenAddress'] | null,
    closestWarehouse: ShippingContext['closestWarehouse'],
    setShippingMethod: Dispatch<SetStateAction<ShippingContext['shippingMethod']>>,
    setError: Dispatch<SetStateAction<ShippingContext['error']>>,
    weight: number = 1,
) {
    await shipping.post('/method', {
        origin: String(closestWarehouse?.cityId),
        destination: String(chosenShippingAddress?.cityId),
        weight: Number(weight),
        courier: 'pos'
    })
        .then((response) => {
            console.log(response.data)
            setShippingMethod(response.data.data)
        })
        .catch((error) => handleError(error, setError))
}

function handleError(
    error: AxiosError<{ message?: string }>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    if (error.response?.status === 401) {
        setError({ status: error.response?.status, message: error.response?.data?.message })
    } else if (error.response?.status === 422 || error.response?.status === 500) {
        setError({ status: error.response?.status, message: error.response?.data?.message })
    } else { throw new Error('An unhandled error occured') }
}