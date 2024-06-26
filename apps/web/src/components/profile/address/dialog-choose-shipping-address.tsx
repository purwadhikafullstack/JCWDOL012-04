"use client"

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAddress } from "@/lib/store/address/address.provider"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"
import { useState } from "react"

export default function ChooseShippingAddressDialog({ ctaLabel }: { ctaLabel: string }) {
    const address = useAddress()
    const { userAddress, choosenAddress, updateChosenAddress } = address
    const [open, setOpen] = useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={'outline'} className="text-[0.6rem] h-fit">{ctaLabel}</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] sm:max-w-[450px] overflow-y-scroll max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Select Shipping Address</DialogTitle>
                    </DialogHeader>
                    {userAddress.map((address, index) => (
                        address.archieved ? null :
                            <Card key={index + 98}>
                                <CardHeader>
                                    <div className="flex flex-row gap-3 flex-wrap">
                                        <CardTitle className="text-sm">{address.label}</CardTitle>
                                        {address.isPrimaryAddress ? <Badge variant={'secondary'} className="text-[0.5rem]">Primary Address</Badge> : null}
                                    </div>
                                    <CardDescription>
                                        <p>{address.city?.type === "KABUPATEN" ? "Kab." : "Kota"} {address.city?.name}</p>
                                        <p>{address.address}</p>
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className={
                                    clsx(`flex flex-row flex-wrap`,
                                        { 'justify-between': choosenAddress?.id === address.id },
                                        { 'justify-end': choosenAddress?.id !== address.id }
                                    )}>
                                    {choosenAddress?.id === address.id
                                        ? <Badge
                                            variant={'default'}
                                            className="text-[0.5rem]"
                                        >
                                            Selected
                                        </Badge>
                                        : null}
                                    {choosenAddress?.id !== address.id
                                        ? <Button
                                            variant={'default'}
                                            className="text-xs h-fit w-fit"
                                            onClick={() => {
                                                updateChosenAddress(address)
                                                setOpen(false)
                                            }
                                            }
                                        >
                                            Select
                                        </Button>
                                        : null}
                                </CardFooter>
                            </Card>))}
                </DialogContent>
            </Dialog>
        </>
    )
}