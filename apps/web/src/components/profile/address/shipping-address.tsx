"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Spinner from "@/components/ui/spinner"
import AddressProvider, { useAddress } from "@/lib/store/address/address.provider"
import { clientSideRedirect } from "@/lib/store/auth/auth.action"
import ChooseShippingAddressDialog from "./dialog-choose-shipping-address"

export default function ShippingAddress() {
    return (
        <AddressProvider>
            <ShippingAddressContent />
        </AddressProvider>
    )
}

function ShippingAddressContent() {
    const address = useAddress()
    const { choosenAddress } = address
    const choosenAddressExist = choosenAddress && Object.keys(choosenAddress!).length !== 0 ? true : false

    return (
        <Card>
            <CardHeader className="mb-0 pb-0 ">
                <CardTitle className="text-sm">Shipping Address</CardTitle>
            </CardHeader>
            {address.isLoading &&
                <CardContent className="flex justify-center">
                    <Spinner className="h-4 w-4 border-2 my-8" />
                </CardContent>}

            {!address.isLoading && (<>
                <CardContent className="py-2">
                    {choosenAddressExist && address.userAddress
                        .filter((address) => address.id === choosenAddress?.id)
                        .map((choosenAddress, index) => (
                            <div key={index + 99}>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-xs font-semibold">{choosenAddress?.label}</h1>
                                    {choosenAddress?.isPrimaryAddress ? <Badge variant={'secondary'} className="text-[0.6rem]">Primary Address</Badge> : null}
                                </div>
                                <p className="text-xs"> {
                                    choosenAddress?.city?.province?.name
                                        + ", "
                                        + choosenAddress?.city?.type === "Kabupaten" ? "Kabupaten " : "Kota "
                                    + choosenAddress?.city?.name
                                } </p>
                                <p className="text-xs">{choosenAddress?.address}</p>
                            </div>
                        ))}

                    {!address.userAddress.length
                        ? <p className="text-xs">You haven't added any addresses.</p>
                        : !choosenAddressExist && <p className="text-xs">You haven't choose any address.</p>}
                </CardContent>
                <CardFooter>
                    {!address.userAddress.length
                        ? <Button variant={'outline'} className="text-xs" onClick={() => clientSideRedirect('/profile/?tab=address')}>Add Shipping Address</Button>
                        : <ChooseShippingAddressDialog ctaLabel={!choosenAddressExist ? "Choose Shipping Address" : "Change Shipping Address"} />}
                </CardFooter>
            </>)}
        </Card>
    )
}