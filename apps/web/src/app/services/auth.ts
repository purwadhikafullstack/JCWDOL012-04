"use client"
import axios, { AxiosError, AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"

const BASE_AUTH_URL = process.env.NEXT_PUBLIC_BASE_AUTH_URL

const auth = axios.create({
    baseURL: BASE_AUTH_URL,
    withCredentials: true,
})

export function login(
    values: { email: string, password: string },
    setState: Dispatch<SetStateAction<null | AxiosResponse | AxiosError['response'] | undefined>>,
    setSubmitting?: (isSubmitting: boolean) => void
) {
    auth.post('login', values)
        .then((response: AxiosResponse) => {
            setState(response)
            setSubmitting ? () => setSubmitting(false) : null
        })
        .catch((error: AxiosError) => {
            setState(error.response)
            setSubmitting ? setSubmitting(false) : null
        })
}

export function googleLogin() {
    clientSideRedirect(`${BASE_AUTH_URL}google`)
}

export function authenticate() {
    auth.get('authenticate')
        .then((response) => response)
        .catch((error) => error.response)
}

export function clientSideRedirect(route: string) {
    return window.location.href = route
}

export function registerUserWithEmail(
    values: { email: string, firstName: string, lastName: string },
    setState: Dispatch<SetStateAction<null | AxiosResponse | AxiosError['response'] | undefined>>,
    setSubmitting?: (isSubmitting: boolean) => void
) {
    auth.post('register', values)
        .then((response: AxiosResponse) => {
            setState(response)
            setSubmitting ? () => setSubmitting(false) : null
        })
        .catch((error: AxiosError) => {
            setState(error.response)
            setSubmitting ? setSubmitting(false) : null
        })
}

export function setPassword(
    value: { password: string },
    token: string,
    setState: Dispatch<SetStateAction<null | AxiosResponse | AxiosError['response'] | undefined>>,
    setSubmitting?: (isSubmitting: boolean) => void
) {
    console.log(value)
    auth.post(`set-password?token=${token}`, value)
        .then((response: AxiosResponse) => {
            setState(response)
            setSubmitting ? () => setSubmitting(false) : null
        })
        .catch((error: AxiosError) => {
            setState(error.response)
            setSubmitting ? setSubmitting(false) : null
        })
}