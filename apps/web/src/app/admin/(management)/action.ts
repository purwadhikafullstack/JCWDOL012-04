import { UsersModel } from "@/model/UsersModel"
import axios, { AxiosResponse, AxiosError } from "axios"
import { cookies } from "next/headers"

export async function verifyUserServerSide(): Promise<null | undefined | UsersModel> {
    const BASE_AUTH_URL = process.env.BASE_AUTH_URL
    if (!BASE_AUTH_URL) throw new Error('BASE_AUTH_URL is not defined')
    const cookie = cookies().get('palugada-auth-token')?.value

    if (cookie) {
        return await axios.get(`${BASE_AUTH_URL}/verify-token`, {
            headers: {
                'Cookie': `palugada-auth-token=${cookie}`
            }
        })
            .then((response: AxiosResponse) => response.data?.data?.user as UsersModel)
            .catch((error: AxiosError) => {
                console.error(error.response?.data)
                return null
            })
    } else {
        return null
    }
}