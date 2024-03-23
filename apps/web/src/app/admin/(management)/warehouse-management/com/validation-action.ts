import { Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { clientSideRedirect } from '@/lib/store/auth/auth.action';
import { ProvincesModel } from '@/model/ProvincesModel';
import { CitiesModel } from '@/model/CitiesModel';

export const initialValues = {
    name: '',
    provinceId: '',
    cityId: '',
    address: '',
    latitude: '',
    longitude: '',
    adminId: ''
}

export const addNewWarehouseValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required('Required'),
    address: Yup.string()
        .min(2, "Must be at least 5 characters")
        .required('Required'),
    cityId: Yup.number()
        .required('Required'),
    provinceId: Yup.string()
        .required('Required'),
    latitude: Yup.string()
        .required('Required'),
    longitude: Yup.string()
        .required('Required'),
    adminId: Yup.string()
})

export const editWarehouseValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required('Required'),
    address: Yup.string()
        .min(2, "Must be at least 5 characters")
        .required('Required'),
    cityId: Yup.number()
        .required('Required'),
    latitude: Yup.number()
        .required('Required'),
    longitude: Yup.number()
        .required('Required'),
})

const WAREHOUSE_BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_BASE_URL ? process.env.NEXT_PUBLIC_WAREHOUSE_BASE_URL : process.env.WAREHOUSE_BASE_URL
const DATA_BASE_URL = process.env.NEXT_PUBLIC_BASE_DATA_URL ? process.env.NEXT_PUBLIC_BASE_DATA_URL : process.env.BASE_DATA_URL
const USER_BASE_URL = process.env.NEXT_PUBLIC_USER_BASE_URL ? process.env.NEXT_PUBLIC_USER_BASE_URL : process.env.USER_BASE_URL

if (!DATA_BASE_URL) throw new Error("No data base URL found")
if (!WAREHOUSE_BASE_URL) throw new Error("No user base URL found")
if (!USER_BASE_URL) throw new Error("No user base URL found")

const warehouse = axios.create({
    baseURL: WAREHOUSE_BASE_URL,
    withCredentials: true
})

const data = axios.create({
    baseURL: DATA_BASE_URL,
    withCredentials: true
})

const user = axios.create({
    baseURL: USER_BASE_URL,
    withCredentials: true
})

export async function getProvinces(
    setProvinces: Dispatch<SetStateAction<ProvincesModel[] | null>>,
    setError: Dispatch<SetStateAction<TWarehouseError | null>>
) {
    return await data.get('/provinces')
        .then((response) => {
            setProvinces(response.data.data)
        })
        .catch((error) => handleError(error, setError));
}

export async function getCitiesOfProvince(
    provinceId: string,
    setCities: Dispatch<SetStateAction<CitiesModel[] | null>>,
    setError: Dispatch<SetStateAction<TWarehouseError | null>>
) {
    return await data.get(`/${provinceId}/cities`)
        .then((response) => {
            setCities(response.data.data)
        })
        .catch((error) => handleError(error, setError));
}

export async function getIdleAdmins(
    setAdmins: Dispatch<SetStateAction<AdminModel[] | null>>,
    setError: Dispatch<SetStateAction<TWarehouseError | null>>
) {
    return await user.get('/admin/idle')
        .then((response) => {
            setAdmins(response.data.data)
        })
        .catch((error) => handleError(error, setError));
}

export async function createWarehouse(
    values: TCreateWH,
    setError: Dispatch<SetStateAction<TWarehouseError>>
) {
    return await warehouse.post('/create', values)
        .then(() => clientSideRedirect('/admin/warehouse-management'))
        .catch((error) => handleError(error, setError));
}

export async function archiveWarehouse(
    id: string | number,
    setError: Dispatch<SetStateAction<TWarehouseError>>
) {
    console.log(id)
    return await warehouse.patch(`/${id}/archive`)
        .then(() => clientSideRedirect('/admin/warehouse-management'))
        .catch((error) => handleError(error, setError));
}

function handleError(
    error: AxiosError<{ message?: string, msg?: string }>,
    setError: Dispatch<SetStateAction<TWarehouseError>>
) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data.message ? error.response?.data.message : error.response?.data.msg

    if (errorStatus === 401 || errorStatus === 422 || errorStatus === 500) {
        setError({ status: errorStatus, message: errorMessage })
    } else { setError({ status: null, message: "Unknown error occured" }) }
}