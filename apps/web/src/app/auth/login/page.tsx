"use client"

import { clientSideRedirect } from "@/lib/store/auth/auth.action";
import LoginForm from "@/components/auth/login-form";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function LoginPage() {

    const auth = useAuth();

    if (auth?.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <Spinner />
        </main>
    )

    if (!auth?.user?.isAuthenticated && !auth?.isLoading) return (
        <main className="flex items-center justify-center my-16 md:my-0 md:h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <LoginForm />
            </div>
        </main>
    )

    if (auth?.user?.isAuthenticated && !auth.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <h1 className="text-2xl text-center text-[var(--primaryColor)]">You are already logged in.</h1>
                <div className="flex flex-col gap-1 justify-center">
                    <button onClick={() => clientSideRedirect('/')} className="text-blue-600">Go to Home</button>
                </div>
            </div>
        </main>
    )

    throw new Error('Unexpected state')
}