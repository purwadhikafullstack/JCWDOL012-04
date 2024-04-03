"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"

export default function AuthMainPage() {
    const param = useSearchParams().get('origin')

    if (param === 'google-auth-failed') {
        return (
            <>
                <main className="h-screen flex flex-col justify-center items-center gap-4">
                    <p>Google Authentication Failed</p>
                    <Button>Go To Home</Button>
                </main>
            </>
        )
    } else {
        return notFound()
    }
}