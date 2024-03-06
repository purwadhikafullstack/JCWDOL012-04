"use client"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"
import { UserAuthType } from "./auth.provider"

const BASE_AUTH_URL = process.env.NEXT_PUBLIC_BASE_AUTH_URL

const auth = axios.create({
    baseURL: BASE_AUTH_URL,
    withCredentials: true
})

export function login(
    values: { email: string, password: string },
    setState: Dispatch<SetStateAction<null | AxiosResponse>>,
    setSubmitting?: (isSubmitting: boolean) => void
) {
    auth.post('login', values)
        .then((response) => {
            setState(response)
            setSubmitting ? () => setSubmitting(false) : null
        })
        .catch((error) => {
            setState(error)
            setSubmitting ? setSubmitting(false) : null
        })
}

export function googleLogin() {
    clientSideRedirect(`${BASE_AUTH_URL}google`)
}

export function verifyToken(
    setUserState: Dispatch<SetStateAction<null | UserAuthType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    auth.get('/verify-token')
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState ? setLoadingState(false) : null
        })
        .catch((error: AxiosError) => {
            console.log(error)
            if (error?.response?.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setLoadingState ? setLoadingState(false) : null
                return
            }
            setLoadingState ? setLoadingState(false) : null
            throw new Error(error.message)
        })
}

export function clientSideRedirect(route: string) {
    return window.location.href = route
}

