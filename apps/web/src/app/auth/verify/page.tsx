"use client"

import VerifySetPassword from "@/components/auth/verify-email"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import axios, { AxiosResponse } from "axios"
import Link from "next/link"
import { notFound, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const isProduction = process.env.NODE_ENV === "production"
const BASE_AUTH_URL = isProduction ? process.env.NEXT_PUBLIC_BASE_AUTH_URL_PROD : process.env.NEXT_PUBLIC_BASE_AUTH_URL_DEV

export default function Verify() {
    const tokenQuery = useSearchParams().get('token')
    if (!tokenQuery) notFound()

    const [tokenStatus, setTokenStatus] = useState<undefined | AxiosResponse>(undefined)
    let isVerified, password

    useEffect(() => {
        axios.get(`${BASE_AUTH_URL}/verify-token?token=${tokenQuery}`)
            .then(res => {
                setTokenStatus(res)
                isVerified = res.data.data.user.isVerified
                password = res.data.data.user.password
                // console.log(res)
            })
            .catch(err => {
                console.error(err)
                setTokenStatus(err.response)
            })
    }, [])

    if (!tokenStatus) return <Spinner />
    if (tokenStatus.status === 200 && isVerified && password) return (
        <div className="flex flex-col w-full h-screen items-center justify-center gap-3 p-6">
            <h1 className="text-2xl text-center">Your Account Is Verified</h1>
            <p className="text-center ">Your account has been successfully verified. Please login.</p>
            <Link className="bold text-purple-800" href="/auth/login">
                <Button className="px-4 mt-6">Login</Button>
            </Link>
        </div>
    )
    if (tokenStatus?.status === 200 && !password) return <VerifySetPassword userName={tokenStatus.data.data.user.firstName} token={tokenQuery} setToken={setTokenStatus} />
    if (tokenStatus.status === 401) return (
        <div className="flex flex-col w-full h-screen items-center justify-center gap-3 p-6">
            <h1 className="text-2xl text-center">Expired or Invalid Verification Link</h1>
            <p className="text-center ">The link you accessed is invalid or expired. Please register again.</p>
            <Link className="bold text-purple-800" href="/auth/register">
                <Button className="px-4 mt-6">Register An Account</Button>
            </Link>
        </div>
    )

    throw new Error('Unknown error')
}
