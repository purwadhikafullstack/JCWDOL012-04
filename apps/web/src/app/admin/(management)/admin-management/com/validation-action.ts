import { Dispatch, SetStateAction } from 'react';
import * as Yup from 'yup';
import { AddAdminError } from './dialog-add-new-admin';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { clientSideRedirect } from '@/lib/store/auth/auth.action';

export const addNewAdminValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .min(6, "Must be at least 6 characters")
        .required('Required'),
    firstName: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required('Required'),
    lastName: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required('Required'),
    gender: Yup.string()
        .oneOf(["male", "female"], "Select one of the options")
        .required('Required')
})

const USER_BASE_URL = process.env.NEXT_PUBLIC_USER_BASE_URL ? process.env.NEXT_PUBLIC_USER_BASE_URL : process.env.USER_BASE_URL
if (!USER_BASE_URL) throw new Error("No user base URL found")

const user = axios.create({
    baseURL: USER_BASE_URL,
    withCredentials: true
})

export async function submitAddNewAdmin(
    values: AdminModel,
    setError: Dispatch<SetStateAction<AddAdminError>>
) {

    user.post('/admin/wh/create', values)
        .then((response: AxiosResponse) => {
            clientSideRedirect('/admin/admin-management')
            return response
        })
        .then(() => setError(null))
        .catch((error: AxiosError<{ message?: string, msg?: string }>) => handleError(error, setError))
}

export async function archieveAdmin(
    id: number | string,
    setError: Dispatch<SetStateAction<AddAdminError>>
) {
    user.patch(`/admin/wh/${id}/archieve`)
        .then((response: AxiosResponse) => {
            clientSideRedirect('/admin/admin-management')
            return response
        })
        .then(() => setError(null))
        .catch((error: AxiosError<{ message?: string, msg?: string }>) => handleError(error, setError))
}

function handleError(
    error: AxiosError<{ message?: string, msg?: string }>,
    setError: Dispatch<SetStateAction<AddAdminError>>
) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data.message ? error.response?.data.message : error.response?.data.msg

    if (errorStatus === 401 || errorStatus === 422 || errorStatus === 500) {
        setError({ status: errorStatus, message: errorMessage })
    } else { setError({ status: null, message: "Unknown error occured" }) }
}