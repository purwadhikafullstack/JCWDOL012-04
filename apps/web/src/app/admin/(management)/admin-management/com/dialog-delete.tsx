"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useState } from "react"
import { AddAdminError } from "./dialog-add-new-admin"
import { archieveAdmin } from "./validation-action"

export default function DeleteWarehouseAdminDialog({ id }: { id: string | number }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<AddAdminError>(null)

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger>
                <Button variant={'link'} className="text-sm px-2 text-red-500">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Warehouse Administrator Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this warehouse administrator account?
                </DialogDescription>
                <DialogFooter>
                    {error?.status && <p className="text-red-500 text-xs">{error?.message}</p>}
                    <Button
                        variant={'outline'}
                        disabled={isSubmitting}
                        onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant={'destructive'}
                        disabled={isSubmitting}
                        onClick={
                            async () => {
                                setIsSubmitting(true)
                                await archieveAdmin(id, setError)
                                setIsSubmitting(false)
                            }
                        }>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}