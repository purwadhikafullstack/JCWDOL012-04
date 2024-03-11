import { Dispatch, SetStateAction } from "react"
import { UserAuthErrorType, UserAuthType } from "./auth.provider"
import axios, { AxiosResponse } from "axios"
import { clientSideRedirect, logOutAction } from "./auth.action"

const BASE_PROFILE_URL = process.env.NEXT_PUBLIC_BASE_PROFILE_URL
const profile = axios.create({
    baseURL: BASE_PROFILE_URL,
    withCredentials: true
})

export async function changeNameAction(
    values: { firstName: string, lastName: string, password: string },
    setUserState: Dispatch<SetStateAction<UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    await profile.patch('change-name', values)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState ? () => setLoadingState(false) : null
            clientSideRedirect('/profile')
        })
        .catch((error) => {
            if (error.response.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function changePasswordAction(
    values: { currentPassword: string, newPassword: string, retypeNewPassword: string },
    setUserState: Dispatch<SetStateAction<UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    await profile.patch('change-password', values)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState ? () => setLoadingState(false) : null
            clientSideRedirect('/profile')
        })
        .catch((error) => {
            if (error.response.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function changeEmailAction(
    values: { newEmail: string, password: string },
    setUserState: Dispatch<SetStateAction<UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    await profile.post('request-change-email', values)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: true, data: response.data.data.user }))
            setLoadingState ? () => setLoadingState(false) : null
            clientSideRedirect('/profile')
        })
        .catch((error) => {
            if (error.response.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function updateEmailAction(
    values: { password: string },
    token: string,
    setUserState: Dispatch<SetStateAction<UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState?: Dispatch<SetStateAction<boolean>>
) {
    await profile.patch(`/change/email${token ? `?token=${token}` : ''}`, values)
        .then((response: AxiosResponse) => {
            logOutAction()
            clientSideRedirect('/auth/login?origin=change-email-success')
        })
        .catch((error) => {
            if (error.response.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login?origin=401')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function verifyChangeEmailToken(
    token: string,
    setUserState: Dispatch<SetStateAction<UserAuthType>>,
    setError: Dispatch<SetStateAction<UserAuthErrorType>>,
    setLoadingState: Dispatch<SetStateAction<boolean>>
) {
    await profile.get(`/change/email/verify-token?token=${token}`)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: prevUser.isAuthenticated, data: response?.data?.data?.user }))
            setLoadingState(false)
        })
        .catch((error) => {
            if (error.response.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState(false)
                throw new Error('An unhandled error occured')
            } setLoadingState(false)
        })
}