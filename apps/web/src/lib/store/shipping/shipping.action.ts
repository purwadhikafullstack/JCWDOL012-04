import axios, { AxiosError, AxiosHeaders } from "axios";
import { Dispatch, SetStateAction } from "react";
import { ShippingContext } from "./shipping.provider";
import { AddressContext } from "../address/address.provider";

const BASE_DATA_URL = process.env.NEXT_PUBLIC_BASE_DATA_URL
const BASE_SHIPPING_URL = process.env.NEXT_PUBLIC_BASE_SHIPPING_URL
if (!BASE_DATA_URL) throw new Error('BASE_DATA_URL is not defined')
if (!BASE_SHIPPING_URL) throw new Error('BASE_SHIPPING_URL is not defined')

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
    await data.get('/closest-wh', { params: { lat: chosenShippingAddress?.latitude, lng: chosenShippingAddress?.longitude } })
        .then((response) => setClosestWarehouse(response.data.data))
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
        .then((response) => setShippingMethod(response.data.data))
        .catch((error) => handleError(error, setError))
}

function handleError(
    error: AxiosError<{ message?: string, msg?: string }>,
    setError: Dispatch<SetStateAction<ShippingContext['error']>>
) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data.message ? error.response?.data.message : error.response?.data.msg

    if (errorStatus === 401 || errorStatus === 422 || errorStatus === 500) {
        setError({ status: errorStatus, message: errorMessage })
    } else { setError({ status: null, message: "Unknown error occured" }) }
}