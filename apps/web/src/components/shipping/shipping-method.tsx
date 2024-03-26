"use client"

import { useAddress } from "@/lib/store/address/address.provider"
import { useShipping } from "@/lib/store/shipping/shipping.provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import SelectShippingMethodDialog from "./dialog-select-shipping-method"
import { formatToRupiah } from "@/utils/helper"

export default function ShippingMethod({ totalWeight }: { totalWeight: number | string }) {
    const shipping = useShipping()
    const address = useAddress()

    if (!address.isAvailable && !address.isLoading) throw new Error("Address context is not loaded")
    if (!shipping.isAvailable && !shipping.isLoading) throw new Error("Shipping context is not loaded")

    const { chosenShippingMethod } = shipping


    return (
        <Card>
            <CardHeader className="mb-0 pb-2">
                <CardTitle className="text-sm">Shipping Method</CardTitle>
                {!shipping.isLoading && !address.choosenAddress?.id && <p className="text-xs">Select shipping address first.</p>}
            </CardHeader>
            {chosenShippingMethod && (
                <CardContent className="mt-0 pb-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs capitalize">{chosenShippingMethod.courier}</p>
                        <p className="text-xs">{chosenShippingMethod.description + ' - ' + chosenShippingMethod.service}</p>
                        <p className="text-xs mb-1"> {` (Est. ${chosenShippingMethod.cost[0].etd.replace('HARI', '')} days)`} </p>
                        <p className="text-xs font-bold">{formatToRupiah(chosenShippingMethod.cost[0].value)}</p>
                    </div>
                </CardContent>
            )}
            <CardFooter className="mt-0">
                <SelectShippingMethodDialog ctaLabel={chosenShippingMethod ? 'Change Shipping Method' : "Select Shipping Method"} totalWeight={totalWeight} />
            </CardFooter>
        </Card>
    )
}