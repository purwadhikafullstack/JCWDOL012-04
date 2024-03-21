"use client"

import ShippingAddress from "@/components/profile/address/shipping-address"
import ShippingMethod from "@/components/shipping/shipping-method"
import AddressProvider from "@/lib/store/address/address.provider"
import ShippingProvider from "@/lib/store/shipping/shipping.provider"

export default function ShippingPage() {

    return (
        <>
            <AddressProvider> {/* Make sure to call this context above the ShippingAddress and ShippingMethod component */}
                <ShippingProvider>  {/* Make sure to call this context above the ShippingAddress and ShippingMethod component */}
                    <ShippingAddress />
                    <ShippingMethod totalWeight={1200} /> {/* Pass the total weight here in Grams */}
                </ShippingProvider>
            </AddressProvider>
        </>
    )
}