"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useAddress } from "@/lib/store/address/address.provider"
import { useState } from "react"

export default function DeleteAddressDialog({ id }: { id: string | number }) {
    const address = useAddress()
    const deleteAddress = () => address.deleteAddress(id)
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>
                <Button variant={'link'} className="text-xs p-0 text-red-500">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Address</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this address?
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
                    <Button disabled={address.isLoading} variant={'destructive'} onClick={deleteAddress}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}