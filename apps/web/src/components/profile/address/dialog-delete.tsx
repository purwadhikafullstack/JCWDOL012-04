"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useAddress } from "@/lib/store/address/address.provider"

export default function DeleteAddressDialog({ id }: { id: string | number }) {
    const address = useAddress()
    const deleteAddress = () => address.deleteAddress(id)


    return (
        <Dialog>
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
                    <Button variant={'outline'}>Cancel</Button>
                    <Button variant={'destructive'} onClick={deleteAddress}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}