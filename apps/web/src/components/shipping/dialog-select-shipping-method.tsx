import { useShipping } from "@/lib/store/shipping/shipping.provider"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { DialogContent, Dialog, DialogTrigger, DialogHeader, DialogTitle } from "../ui/dialog"
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { formatToRupiah } from "@/utils/helper"
import { useAddress } from "@/lib/store/address/address.provider"

export default function SelectShippingMethodDialog({ ctaLabel, totalWeight }: { ctaLabel: string, totalWeight?: number | string }) {
    const shipping = useShipping()
    const address = useAddress()
    const { shippingMethod } = shipping
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        if (dialogOpen) shipping.getShippingMethod(Number(totalWeight))
    }, [dialogOpen])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button variant={'outline'} disabled={address.isLoading || shipping.isLoading || !address.choosenAddress?.id} className="text-[0.6rem] h-fit">{ctaLabel}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[450px] overflow-y-scroll max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Select Shipping Method</DialogTitle>
                </DialogHeader>
                {shipping.isLoading && <p className="text-center my-4">Loading...</p>}
                {!shipping.isLoading && shippingMethod?.map((method) => (
                    method.costs.map((cost, index) => (
                        <Card key={index + 8}>
                            <CardHeader>
                                <CardTitle className="text-sm capitalize">{method.name}</CardTitle>
                                <p className="text-sm">{cost.description + ' - ' + cost.service}</p>
                                <p className="text-xs">{formatToRupiah(Number(cost.cost[0].value))} {` | ${cost.cost[0].etd.replace('HARI', '')} days (Estimation)`}</p>
                            </CardHeader>
                            <CardFooter className="flex justify-end">
                                <Button
                                    variant={'default'}
                                    className="text-xs h-fit w-fit"
                                    onClick={() => {
                                        shipping.set.chosenShippingMethod({ ...cost, courier: method.name })
                                        shipping.set.shippingCost(Number(cost.cost[0].value))
                                        setDialogOpen(false)
                                    }}
                                >
                                    Select
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ))}
                {!shipping.isLoading && shippingMethod && shippingMethod[0]?.costs?.length === 0 && <p className="text-center my-4">No shipping method available for this route.</p>}
            </DialogContent>
        </Dialog >
    )
}