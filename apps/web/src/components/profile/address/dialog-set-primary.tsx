"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useAddress } from "@/lib/store/address/address.provider"
import { useState } from "react"

export default function SetAsPrimaryAddressDialog({ id }: { id: string | number }) {
    const address = useAddress()
    const setAsPrimary = () => address.setAsPrimary(id)
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>
                <Button variant={'link'} className="text-xs p-0">Set As Primary Address</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Primary Address</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to set it as primary address?
                </DialogDescription>
                <DialogFooter>
                    <div>
                        {address?.error?.status
                            ? (<div className="text-red-500 text-xs">
                                {address.error?.message ? address.error?.message : 'An Error occured. Something went wrong'}
                            </div>)
                            : null}
                    </div>
                    <Button variant={'outline'} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button disabled={address.isLoading} variant={'default'} onClick={setAsPrimary}>Set As Primary Address</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}