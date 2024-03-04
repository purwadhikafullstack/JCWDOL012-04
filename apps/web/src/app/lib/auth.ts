"use client"
import axios, { AxiosResponse } from "axios"
import { Dispatch, SetStateAction } from "react"

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

export function authenticate() {
    auth.get('authenticate')
        .then((response) => response)
        .catch((error) => error)
}

export function clientSideRedirect(route: string) {
    return window.location.href = route
}

