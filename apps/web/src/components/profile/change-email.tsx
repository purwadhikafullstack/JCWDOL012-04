"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/store/auth/auth.provider"

export default function ChangeEmailDialog() {
    const auth = useAuth()
    const user = useAuth()?.user?.data

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Email</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Email</DialogTitle>
                    <DialogDescription>
                        We will send an instruction to your new email to complete your changes. Type your new email, and then click submit when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="newEmail" >
                                New Email
                            </Label>
                            <Input
                                id="newEmail"
                                placeholder="Enter your new email address"
                                className="col-span-3"
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="submit" onSubmit={(e) => console.log(e)}>Submit</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
