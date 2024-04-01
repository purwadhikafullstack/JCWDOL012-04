"use client"
import { useAuth } from "@/lib/store/auth/auth.provider";
import { useEffect } from "react";

export default function Logout() {

    const auth = useAuth()

    useEffect(() => {
        if (auth?.isLoading) {
            return
        }
        else if (!auth?.user?.isAuthenticated) {
            window.location.href = "/"
        } else if (auth?.user?.isAuthenticated) {
            auth.logOut()
        } else {
            return
        }
    }, [auth])

    return (
        <div className="flex justify-center items-center h-screen w-full">
            <h1>Logging out...</h1>
        </div>
    )
}