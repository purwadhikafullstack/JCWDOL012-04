"use client"

import { Button } from "../ui/button"

export default function UnauthorizedPage(
    {
        message,
        redirectTo,
        ctaLabel
    }: {
        message?: string,
        redirectTo?: string,
        ctaLabel?: string
    }
) {
    return (
        <main className="flex flex-col gap-3 items-center justify-center h-full ">
            <h1 className="text-md text-center">{message ? message : "You are not authorized to view this page."}</h1>
            <Button onClick={() => window.location.href = redirectTo ? redirectTo : '/'} className="w-fit">  {ctaLabel ? ctaLabel : "Go to Home"}</Button>
        </main>
    )
}