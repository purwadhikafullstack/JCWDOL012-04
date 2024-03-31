import { Dispatch, SetStateAction } from "react"
import { AuthContextType } from "./auth.provider"
import axios, { AxiosError, AxiosResponse } from "axios"
import { clientSideRedirect, logOutAction } from "./auth.action"

const BASE_PROFILE_URL = process.env.NEXT_PUBLIC_BASE_PROFILE_URL
if (!BASE_PROFILE_URL) throw new Error('BASE_PROFILE_URL is not defined')

const profile = axios.create({
    baseURL: BASE_PROFILE_URL,
    withCredentials: true
})

export async function changeNameAction(
    values: { firstName: string, lastName: string, password: string },
) {
    return await profile.patch('change-name', values)
        .then((response: AxiosResponse) => response.data.data.user)
        .catch((error: AxiosError<{ message?: string, msg?: string }>) => handleErrorCB(error))
}

export async function changeEmailAction(
    values: { newEmail: string, password: string }
) {
    return await profile.post('request-change-email', values)
        .then((response: AxiosResponse) => response?.data?.data?.user)
        .catch((error: AxiosError<{ message?: string, msg?: string }>) => handleErrorCB(error))
}

export async function changePasswordAction(
    values: { currentPassword: string, newPassword: string, retypeNewPassword: string },
) {
    return await profile.patch('change-password', values)
        .then((response: AxiosResponse) => response.data.data)
        .catch((error: AxiosError<{ message?: string, msg?: string }>) => handleErrorCB(error))
}

export async function updateEmailAction(
    values: { password: string },
    token: string,
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    await profile.patch(`/change/email${token ? `?token=${token}` : ''}`, values)
        .then((response: AxiosResponse) => {
            logOutAction()
            clientSideRedirect('/auth/login?origin=change-email-success')
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response?.data })
                clientSideRedirect('/auth/login?origin=401')
            } else if (error?.response?.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data?.msg })
            } else {
                setLoadingState ? setLoadingState(false) : null
                throw new Error('An unhandled error occured')
            } setLoadingState ? setLoadingState(false) : null
        })
}

export async function verifyChangeEmailToken(
    token: string,
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    await profile.get(`/change/email/verify-token?token=${token}`)
        .then((response: AxiosResponse) => {
            setUserState(prevUser => ({ ...prevUser, isAuthenticated: prevUser.isAuthenticated, data: response?.data?.data?.user }))
            setLoadingState(false)
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
            } else if (error?.response?.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState(false)
                throw new Error('An unhandled error occured')
            } setLoadingState(false)
        })
}

export async function updateProfilePictureAction(
    values: { file: File },
    setUserState: Dispatch<SetStateAction<AuthContextType['user']>>,
    setError: Dispatch<SetStateAction<AuthContextType['error']>>,
    setLoadingState: Dispatch<SetStateAction<AuthContextType['isLoading']>>
) {
    const formData = new FormData()
    formData.append('file', values.file)
    await profile.patch('/change/profile-picture', formData)
        .then(() => clientSideRedirect('/profile'))
        .catch((error) => {
            if (error?.response?.status === 401) {
                setUserState(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }))
                setError({ status: error.response.status, message: error.response.data })
                clientSideRedirect('/auth/login?origin=401')
            } else if (error.response.status === 422 || error.response.status === 500) {
                setError({ status: error.response.status, message: error.response.data.msg })
            } else {
                setLoadingState(false)
                throw new Error('An unhandled error occured')
            } setLoadingState(false)
        })
}

function handleErrorCB(error: AxiosError<{ message?: string, msg?: string }>) {
    const errorStatus = error.response?.status
    const errorMessage = error.response?.data?.msg ? error.response?.data?.msg : error.response?.data?.message
    if (errorStatus) {
        return { error: { status: errorStatus, message: errorMessage } }
    } else {
        return { error: { status: null, message: "Unknown error occured" } }
    }
}