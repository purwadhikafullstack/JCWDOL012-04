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

export default function ProfilePage() {
    const origin = useSearchParams().get('tab')
    const defaultTab = origin === 'address' ? 'address' : 'account'
    const auth = useAuth()

    if (auth?.user.data?.role !== "CUSTOMER" && !auth?.isLoading) return (
        <h1 className="text-center mt-6">401: You are not authorized to access this page</h1>
    )

    return (
        <AddressProvider>
            <Tabs defaultValue={defaultTab} className="max-w-screen-sm mx-auto mt-6 px-4 md:px-0" >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                </TabsList>
                <TabAccount />
                <TabAddress />
            </Tabs>
        </AddressProvider>
    )
}
