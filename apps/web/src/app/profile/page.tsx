"use client"

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import TabAccount from "@/components/profile/tab-account"
import TabAddress from "@/components/profile/tab-address"

export default function ProfilePage() {

    return (
        <Tabs defaultValue="account" className="max-w-screen-sm mx-auto mt-6 px-4 md:px-0" >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabAccount />
            <TabAddress />
        </Tabs>
    )
}
