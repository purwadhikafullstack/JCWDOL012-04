import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react"
import { AddressContext } from "./address.provider";
import { UsersModel } from "@/model/UsersModel";
import { clientSideRedirect } from "../auth/auth.action";

const BASE_USER_URL = process.env.NEXT_PUBLIC_BASE_USER_URL
const BASE_DATA_URL = process.env.NEXT_PUBLIC_BASE_DATA_URL

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

export async function fetchCities(
    provinceId: string | number,
    setCities: Dispatch<SetStateAction<AddressContext['data']['cities']>>,
    setError: Dispatch<SetStateAction<AddressContext['error']>>
) {
    await data.get(`/${provinceId}/cities`)
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