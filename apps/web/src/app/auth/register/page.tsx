"use client"

import UserRegistrationForm from "@/components/auth/user-registration-form"
import { useAuth } from "@/lib/store/auth/auth.provider"
import Spinner from "@/components/ui/spinner";
import { clientSideRedirect } from "@/lib/store/auth/auth.action";
import { useSearchParams } from "next/navigation";

export default function UserRegistrationPage() {
    const auth = useAuth();

    if (auth?.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <Spinner />
        </main>
    )

    if (useSearchParams().get('registration') == 'success') return (
        <main className="flex items-center justify-center h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <h1 className="text-2xl text-center text-[var(--primaryColor)]">Registration Successful</h1>
                <p className="text-center">Please check your email to verify your account.</p>
                <button onClick={() => clientSideRedirect('/')} className="text-blue-600">Go to Home</button>
            </div>
        </main>
    )

    if (!auth?.user?.isAuthenticated && !auth?.isLoading) return (
        <main className="flex items-center justify-center min-h-screen px-5  ">
            <div className=" mx-auto  flex w-full max-w-[400px] flex-col  ">
                <UserRegistrationForm />
            </div>
        </main>
    )

    if (auth?.user?.isAuthenticated && !auth.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <h1 className="text-2xl text-center text-[var(--primaryColor)]">You are logged in.</h1>
                <p className="text-center">You have to logout first in order to create an account.</p>
                <div className="flex flex-col gap-1 justify-center">
                    <button onClick={() => auth.logOut()} className="text-blue-600">Logout</button>
                    <button onClick={() => clientSideRedirect('/')} className="text-blue-600">Go to Home</button>
                </div>
            </div>
        </main>
    )

    throw new Error('Unexpected state')
}