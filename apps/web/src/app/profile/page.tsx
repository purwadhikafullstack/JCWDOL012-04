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
import UnauthorizedPage from "@/components/auth/unauthorized"

export default function ProfilePage() {
    const origin = useSearchParams().get('tab')
    const defaultTab = origin === 'address' ? 'address' : 'account'
    const user = useAuth()

    if (user?.user.data?.role !== "CUSTOMER") return (
        <UnauthorizedPage />
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
