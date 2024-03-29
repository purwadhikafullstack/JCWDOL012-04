"use client"

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import TabAccount from "@/components/profile/tab-account"
import TabAddress from "@/components/profile/tab-address"
import AddressProvider from "@/lib/store/address/address.provider"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
    const origin = useSearchParams().get('tab')
    const defaultTab = origin === 'address' ? 'address' : 'account'
    const auth = useAuth()

    if (auth?.isLoading && defaultTab === 'account') return <AccountTabSkelLoading />
    if (auth?.isLoading && defaultTab === 'address') return <AddressTabSkelLoading />

    if (auth?.user.data?.role !== "CUSTOMER" && !auth?.isLoading && !auth?.user.isAuthenticated) return (
        <h1 className="text-center mt-6">401: You are not authorized to access this page</h1>
    )

    if (!auth.isLoading) return (
        <Tabs defaultValue={defaultTab} className="max-w-screen-sm mx-auto mt-6 px-4 md:px-0" >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabAccount />
            <AddressProvider>
                <TabAddress />
            </AddressProvider >
        </Tabs>
    )
}

function AccountTabSkelLoading() {
    return (
        <>
            <div className="max-w-screen-sm flex flex-col gap-3 mx-auto mt-6 px-4 md:px-0">
                <Skeleton className="rounded-sm h-10 w-full" />
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between h-60 gap-3">
                    <Skeleton className="h-14 w-[248px]" />
                    <Skeleton className="rounded-full h-40 w-40" />
                </div>
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
            </div>
        </>
    )
}

function AddressTabSkelLoading() {
    return (
        <>
            <div className="max-w-screen-sm flex flex-col gap-3 mx-auto mt-6 px-4 md:px-0">
                <Skeleton className="rounded-sm h-10 w-full" />
                <div className="flex gap-3 justify-between items-center h-28 w-full p-5">
                    <Skeleton className="rounded-sm h-9 max-w-[150px] w-full" />
                    <Skeleton className="rounded-sm h-9 max-w-[100px] w-full" />
                </div>
                <div className="flex flex-col gap-6 px-5">
                    <Skeleton className="rounded-sm h-9 w-full" />
                    <Skeleton className="rounded-sm h-9 w-full" />
                    <Skeleton className="rounded-sm h-9 w-full" />
                    <Skeleton className="rounded-sm h-9 w-full" />
                </div>
            </div>
        </>
    )
}