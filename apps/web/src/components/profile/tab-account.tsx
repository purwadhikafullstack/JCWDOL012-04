import { ChangeNameDialog } from "@/components/profile/change-name"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    TabsContent,
} from "@/components/ui/tabs"
import { useAuth } from "@/lib/store/auth/auth.provider"
import ChangeEmailDialog from "./change-email"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import ChangeProfilePictDialog from "./change-profile-pict"
import { ChangePasswordDialog } from "./change-password"

export default function TabAccount() {
    const user = useAuth()?.user?.data

    return (
        <>
            <TabsContent value="account" >
                <Card>
                    <CardHeader className="flex items-center sm:flex-row sm:justify-between gap-3">
                        <div className="flex flex-col justify-center items-center sm:items-start">
                            <CardTitle>{`Hi, ${user?.firstName ? `${user.firstName}!` : "..."}`}</CardTitle>
                            <CardDescription>
                                Make changes to your account here.
                            </CardDescription>
                        </div>
                        <Avatar className="flex flex-col items-center justify-center gap-1">
                            <AvatarImage
                                src="/profile-pict.jpg"
                                className="max-w-[150px] rounded-full"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                            <ChangeProfilePictDialog />
                        </Avatar>
                    </CardHeader>
                    <CardContent className="space-y-2 my-4">
                        <div className="space-y-1">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={user?.firstName} disabled />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="lastName">Last Name</Label>
                            <div className="flex gap-1">
                                <Input id="lastName" defaultValue={user?.lastName} disabled />
                                <ChangeNameDialog />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-1">
                                <Input id="email" defaultValue={user?.email} disabled />
                                <ChangeEmailDialog />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="flex gap-1">
                                <Input id="password" defaultValue="******" disabled />
                                <ChangePasswordDialog />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}