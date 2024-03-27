import ShippingAddress from "@/components/profile/address/shipping-address";
import ShippingMethod from "@/components/shipping/shipping-method";
import AddressProvider from "@/lib/store/address/address.provider";
import ShippingProvider from "@/lib/store/shipping/shipping.provider";

export default function Testing() {
    return (
        <>
            <AddressProvider>
                <ShippingProvider>
                    <ShippingAddress />
                    <ShippingMethod totalWeight={1200} />
                </ShippingProvider>
            </AddressProvider>
        </>
    )
}