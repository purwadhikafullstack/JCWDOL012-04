"use client"

import ShippingAddress from "@/components/profile/address/shipping-address"
import ShippingMethod from "@/components/shipping/shipping-method"
import AddressProvider from "@/lib/store/address/address.provider"
import ShippingProvider from "@/lib/store/shipping/shipping.provider"

export default function ShippingPage() {

    return (
        <>
            <AddressProvider>
                <ShippingProvider>
                    <ShippingAddress />
                    <ShippingMethod />
                </ShippingProvider>
            </AddressProvider>
        </>
    )
}