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

export default function ChangeProfilePictDialog() {
    const auth = useAuth()
    const user = useAuth()?.user?.data

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Picture</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Profile Picture</DialogTitle>
                    <DialogDescription>
                        Choose your new profile picture file, and then click Save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="profilePicture" >
                                Picture
                            </Label>
                            <Input
                                id="profilePicture"
                                type="file"
                                className="col-span-3"
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="submit" onSubmit={(e) => console.log(e)}>Save</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
