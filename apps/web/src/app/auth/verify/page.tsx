"use client"

import { clientSideRedirect } from "@/lib/store/auth/auth.action"
import VerifySetPassword from "@/components/auth/verify-email"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { useAuth } from "@/lib/store/auth/auth.provider"
import Link from "next/link"
import { notFound, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const isProduction = process.env.NODE_ENV === "production"
const BASE_AUTH_URL = isProduction ? process.env.NEXT_PUBLIC_BASE_AUTH_URL_PROD : process.env.NEXT_PUBLIC_BASE_AUTH_URL_DEV

export default function Verify() {
    const tokenQuery = useSearchParams().get('token')
    if (!tokenQuery) notFound()

    const auth = useAuth()

    useEffect(() => {
        auth?.verifyActivationToken(tokenQuery)
    }, [])

    if (auth?.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <Spinner />
        </main>

    )
    if (auth?.user?.isAuthenticated && auth.user.data?.password) return (
        <main className="flex items-center justify-center h-screen ">
            {clientSideRedirect('/')}
        </main>
    )

    if (auth?.error.status) return (
        <div className="flex flex-col w-full h-screen items-center justify-center gap-3 p-6">
            <h1 className="text-2xl text-center">Expired or Invalid Verification Link</h1>
            <p className="text-center ">The link you accessed is invalid or expired. Please register again.</p>
            <Link className="bold text-purple-800" href="/auth/register">
                <Button className="px-4 mt-6">Go To Registration Page</Button>
            </Link>
        </div>
    )

    if (auth?.user?.data?.isVerified && auth?.user?.data?.password) return (
        <div className="flex flex-col w-full h-screen items-center justify-center gap-3 p-6">
            <h1 className="text-2xl text-center">Account Verified</h1>
            <p className="text-center ">Your account has been successfully verified. Please login.</p>
            <Link className="bold text-purple-800" href="/auth/login">
                <Button className="px-4 mt-6">Login</Button>
            </Link>
        </div>
    )

    if (!auth?.user?.data?.password && !auth?.isLoading) {
        return (
            <VerifySetPassword token={tokenQuery} />
        )
    }

}
