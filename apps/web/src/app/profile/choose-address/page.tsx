"use client"

import ShippingAddress from "@/components/profile/address/shipping-address"
import AddressProvider from "@/lib/store/address/address.provider"

export default function TestChooseShippingAddressPage() {
    return (
        <AddressProvider>
            <ShippingAddress />
        </AddressProvider>
    )
}