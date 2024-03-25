// import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

export function ChangeErrorNoPassword({ isLoading, label }: { isLoading: boolean, label: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={isLoading} className="text-xs sm:text-sm capitalize">{label}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Up A Password</DialogTitle>
                    <DialogDescription>Set up a password first before you can make changes.</DialogDescription>
                </DialogHeader>
                <Alert variant={'destructive'} className="my-4">
                    <AlertDescription>
                        {"You haven't set up a password because you initially created this account with a Google Login Service. Please register an account with the same email as your Google Account first."}
                    </AlertDescription>
                </Alert>
                <DialogFooter>
                    <Link href={'/auth/register'}> <Button>Register An Account</Button></Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}