"use client"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"
import { AuthContextType } from "./auth.provider"

const BASE_AUTH_URL = process.env.NEXT_PUBLIC_BASE_AUTH_URL
if (!BASE_AUTH_URL) throw new Error('BASE_AUTH_URL is not defined')

const auth = axios.create({
    baseURL: BASE_AUTH_URL,
    withCredentials: true
})

export function logInAction(
    values: { email: string, password: string },
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    auth.post('login', values)
        .then((response) => {
            const prevPath = sessionStorage.getItem('prevPath')
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState(false)
            clientSideRedirect(prevPath ? prevPath : '/')
        })
        .catch((error) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            setError({ status: error.response.status, message: error.response.data.message })
            setLoadingState(false)
        })
}

export function registerWithEmailAction(
    values: { email: string, firstName: string, lastName: string },
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    auth.post('register', values)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: null }))
            setLoadingState ? () => setLoadingState(false) : null
            clientSideRedirect('?registration=success')
        })
        .catch((error) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            setError({ status: error.response?.status, message: error.response?.data?.message })
            setLoadingState ? () => setLoadingState(false) : null
        })
}

export function logOutAction() {
    document.cookie = "palugada-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear()
}

export function googleLogin() {
    clientSideRedirect(`${BASE_AUTH_URL}google`)
}

export async function verifyToken(
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>,
    token?: string,
    path?: string,
) {
    await auth.get(`/verify-token${token ? `?token=${token}` : ''}`)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: token ? false : true, data: response.data.data.user }))
            setLoadingState ? setLoadingState(false) : null
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                if (path?.includes('/profile')) clientSideRedirect('/auth/login?origin=401')
            } else if (error?.response?.status === 422 || error.response?.status === 500) {
                setError({ status: error.response?.status, message: error.response?.data?.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function setPasswordAction(
    value: { password: string },
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>,
    token?: string,
    redirectTo?: string
) {
    await auth.post(`set-password?token=${token}`, value)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            redirectTo ? clientSideRedirect(redirectTo) : null
            setLoadingState ? setLoadingState(false) : null
        })
        .catch((error) => {

            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            setError({ status: error?.response?.status, message: error?.response?.data?.message })
            setLoadingState ? setLoadingState(false) : null
        })
}

export async function initChangeRequestAction(
    value: { email: string },
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>,
) {
    await auth.post('reset-password', value)
        .then(() => {
            setLoadingState(false)
            clientSideRedirect('/auth/reset-password?reset=success')
        })
        .catch((error) => {
            setLoadingState(false)
            setError(
                {
                    status: error.response.status,
                    message: error.response.data.message ? error.response.data.message : error.response.data.msg,
                    code: error.response.data.code
                })
        })
}

export async function verifyResetPasswordRequest(
    token: string,
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    await auth.get(`reset-password/verify-request?token=${token}`)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: response.data.data }))
            setLoadingState(false)
        })
        .catch((error) => {
            handleError(error, setError)
        })

}

export async function resetNewPassword(
    value: { newPassword: string },
    token: string,
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    await auth.patch(`reset-password/set-new-password?token=${token}`, value)
        .then(() => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            clientSideRedirect('/auth/login?reset=success')
        })
        .catch((error) => {
            handleError(error, setError)
            setLoadingState(false)
        })
}

export function clientSideRedirect(route: string) {
    return window.location.href = route
}

function handleError(
    error: AxiosError<{ message?: string, msg?: string }>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>
) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data.message ? error.response?.data.message : error.response?.data.msg

    if (errorStatus === 401 || errorStatus === 422 || errorStatus === 500) {
        setError({ status: errorStatus, message: errorMessage })
    } else { setError({ status: null, message: "Unknown error occured" }) }
}