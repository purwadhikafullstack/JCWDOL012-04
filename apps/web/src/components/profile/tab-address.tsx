"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { useAddress } from "@/lib/store/address/address.provider"
import { Badge } from "../ui/badge"
import { AddAddress } from "./address/add"
import Spinner from "../ui/spinner"
import { APIProvider } from "@vis.gl/react-google-maps"

export default function TabAddress() {
    const auth = useAuth()
    const address = useAddress()

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} >
            <TabsContent value="address">
                <Card>
                    <CardHeader className="flex flex-row gap-1 justify-between flex-wrap">
                        <div className="flex flex-col gap-2">
                            <CardTitle >Address</CardTitle>
                            <CardDescription>
                                Manage your addresses
                            </CardDescription>
                        </div>
                        <AddAddress />
                    </CardHeader>
                    {auth?.isLoading || address.isLoading
                        ? <CardContent className="text-center"><Spinner /></CardContent>
                        : (<CardContent className="space-y-2">
                            {address.userAddress.map((address, index) => (
                                address.archieved ? null :
                                    <Card key={index + 9873}>
                                        <CardHeader>
                                            <div className="flex flex-row gap-3 flex-wrap">
                                                <CardTitle className="text-sm">{address.label}</CardTitle>
                                                {address.isPrimaryAddress ? <Badge variant={'secondary'}>Primary Address</Badge> : null}
                                            </div>
                                            <CardDescription>{address.address}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-wrap gap-3 my-[-15px]">
                                            <Button variant={'link'} className="text-xs p-0">Edit</Button>
                                            <Button variant={'link'} className="text-xs p-0">Set As Primary</Button>
                                            <Button variant={'link'} className="text-xs p-0 text-red-500">Delete</Button>
                                        </CardContent>
                                    </Card>))}
                        </CardContent>)}
                </Card>
            </TabsContent>
        </APIProvider>
    )
}