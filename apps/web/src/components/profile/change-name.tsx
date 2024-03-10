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

export function ChangeNameDialog() {
    const auth = useAuth()
    const user = useAuth()?.user?.data

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Name</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Name</DialogTitle>
                    <DialogDescription>
                        Make changes to your name here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" >
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                defaultValue={user?.firstName}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" >
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                defaultValue={user?.lastName}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" >
                                Your Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password to save changes"
                                className="col-span-3"
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" >Save changes</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
