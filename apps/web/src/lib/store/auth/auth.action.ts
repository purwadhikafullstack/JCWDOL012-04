"use client"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"
import { UserAuthErrorType, UserAuthType } from "./auth.provider"

const BASE_AUTH_URL = process.env.NEXT_PUBLIC_BASE_AUTH_URL

const auth = axios.create({
    baseURL: BASE_AUTH_URL,
    withCredentials: true
})

export function logInAction(
    values: { email: string, password: string },
    setUserState: Dispatch<SetStateAction<null | UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    auth.post('login', values)
        .then((response) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState ? () => setLoadingState(false) : null
            clientSideRedirect('/')
        })
        .catch((error) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            setError({ status: error.response.status, message: error.response.data.message })
            setLoadingState ? setLoadingState(false) : null
        })
}

export function registerWithEmailAction(
    values: { email: string, firstName: string, lastName: string },
    setUserState: Dispatch<SetStateAction<null | UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
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
}

export function googleLogin() {
    clientSideRedirect(`${BASE_AUTH_URL}google`)
}

export function verifyToken(
    setUserState: Dispatch<SetStateAction<null | UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>,
    token?: string
) {
    auth.get(`/verify-token${token ? `?token=${token}` : ''}`)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: token ? false : true, data: response.data.data.user }))
            setLoadingState ? setLoadingState(false) : null
        })
        .catch((error) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
            setError({ status: error?.response?.status, message: error?.response?.data?.message })
            setLoadingState ? setLoadingState(false) : null
        })
}

export function setPasswordAction(
    value: { password: string },
    setUserState: Dispatch<SetStateAction<null | UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>,
    token?: string,
    redirectTo?: string
) {
    auth.post(`set-password?token=${token}`, value)
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

export function clientSideRedirect(route: string) {
    return window.location.href = route
}

