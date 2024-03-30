import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react"
import { AddressContext } from "./address.provider";
import { UsersModel } from "@/model/UsersModel";
import { clientSideRedirect } from "../auth/auth.action";

const BASE_USER_URL = process.env.NEXT_PUBLIC_BASE_USER_URL
const BASE_DATA_URL = process.env.NEXT_PUBLIC_BASE_DATA_URL
if (!BASE_USER_URL) throw new Error('BASE_USER_URL is not defined')
if (!BASE_DATA_URL) throw new Error('BASE_DATA_URL is not defined')

const user = axios.create({
    baseURL: BASE_USER_URL,
    withCredentials: true
})

const data = axios.create({
    baseURL: BASE_DATA_URL,
    withCredentials: true
})

export async function fetchAddressAction(
    userID: UsersModel['id'],
    setAddressState: Dispatch<SetStateAction<AddressContext['userAddress']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await user.get(`/address`)
        .then((response) => setAddressState(response.data.data))
        .catch((error) => handleError(error, setError))
}

export async function getChoosenAddress(
    primaryAddress: AddressContext['userAddress'][0],
    setChoosenAddress: Dispatch<SetStateAction<AddressContext['choosenAddress']>>
) {
    if (localStorage.getItem('palugada-cust-choosen-address')) {
        setChoosenAddress(JSON.parse(localStorage.getItem('palugada-cust-choosen-address')!))
    } else if (primaryAddress) {
        localStorage.setItem('palugada-cust-choosen-address', JSON.stringify({ id: primaryAddress.id }))
        setChoosenAddress(primaryAddress)
    } else {
        setChoosenAddress(null)
    }
}

export async function updateChoosenAddressAction(
    address: AddressContext['userAddress'][0] | null,
    setChoosenAddress: Dispatch<SetStateAction<AddressContext['choosenAddress']>>
) {
    localStorage.setItem('palugada-cust-choosen-address', JSON.stringify({ id: address?.id }))
    setChoosenAddress(address)
}


export async function fetchCities(
    setCities: Dispatch<SetStateAction<AddressContext['data']['cities']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>,
    provinceId?: string | number,
) {
    await data.get(provinceId ? `/${provinceId}/cities` : '/cities')
        .then((response) => setCities(response.data?.data))
        .catch((error) => handleError(error, setError))
}

export async function fetchProvinces(
    setProvinces: Dispatch<SetStateAction<AddressContext['data']['provinces']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await data.get('/provinces')
        .then((response) => setProvinces(response.data.data))
        .catch((error) => handleError(error, setError))
}

export async function addAddressAction(
    values: AddressContext['userAddress'][0],
    setAddressState: Dispatch<SetStateAction<AddressContext['userAddress']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await user.post('/address/add', values)
        .then(() => clientSideRedirect('/profile?tab=address'))
        .catch((error) => handleError(error, setError))
}

export async function deleteAddressAction(
    id: number | string,
    setAddressState: Dispatch<SetStateAction<AddressContext['userAddress']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await user.patch(`/address/${id}/archieve`)
        .then(() => clientSideRedirect('/profile?tab=address'))
        .catch((error) => handleError(error, setError))
}

export async function setAsPrimaryAddressAction(
    id: number | string,
    setAddressState: Dispatch<SetStateAction<AddressContext['userAddress']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await user.patch(`/address/${id}/set-primary`)
        .then(() => clientSideRedirect('/profile?tab=address'))
        .catch((error) => handleError(error, setError))
}

export async function updateAddressAction(
    id: number | string,
    values: AddressContext['userAddress'][0],
    setAddressState: Dispatch<SetStateAction<AddressContext['userAddress']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await user.patch(`/address/${id}/update`, values)
        .then(() => clientSideRedirect('/profile?tab=address'))
        .catch((error) => handleError(error, setError))
}

function handleError(
    error: AxiosError<{ message?: string, msg?: string }>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data.message || error.response?.data.msg
    if (errorStatus === 401) {
        setError({ status: errorStatus, message: errorMessage })
    } else if (errorStatus === 422 || errorStatus === 500) {
        setError({ status: errorStatus, message: errorMessage })
    } else { throw new Error('An unhandled error occured') }
}