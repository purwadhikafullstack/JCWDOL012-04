"use client"

import ResetPasswordForm from "@/components/auth/reset-password-form"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { clientSideRedirect } from "@/lib/store/auth/auth.action"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
    const auth = useAuth()
    const reset = useSearchParams().get('reset')

    if (reset === 'success') {
        return (
            <div className="flex justify-center items-center h-[70vh] w-full text-center">
                <div className="max-w-[500px] mx-2 flex flex-col gap-3">
                    <h1>We have sent instructions to reset your password to your email. Please check you email and follow the instructions.</h1>
                    <Button onClick={() => clientSideRedirect('/')}>Go To Home Page</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center h-[70vh] pt-9 px-2 md:h-[85vh] md:justify-center md:pt-0 ">
            {auth?.isLoading && <Spinner />}
            {!auth?.isLoading && <ResetPasswordForm />}
        </div>
    )
}