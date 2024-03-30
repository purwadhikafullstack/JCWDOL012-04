"use client"

import { clientSideRedirect } from "@/lib/store/auth/auth.action";
import LoginForm from "@/components/auth/login-form";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function LoginPage() {
    const auth = useAuth();
    const prevPath = typeof window !== 'undefined' && sessionStorage.getItem('prevPath')

    function delayedRedirect() {
        setTimeout(() => {
            clientSideRedirect(prevPath ? prevPath : '/')
        }, 1500)
    }

    if (auth?.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <Spinner />
        </main>
    )

    if (!auth?.user?.isAuthenticated) return (
        <main className="flex items-center justify-center min-h-screen px-5  ">
            <div className=" mx-auto  flex w-full max-w-[400px] flex-col  ">
                <LoginForm />
            </div>
        </main>
    )

    if (auth?.user?.isAuthenticated) {
        delayedRedirect()
        return (
            <main className="flex items-center justify-center h-screen ">
                <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                    <h1 className="text-xl text-center text-[var(--primaryColor)]">You are logged in.</h1>
                </div>
            </main>
        )
    }

    throw new Error('Unexpected state in login process')
}