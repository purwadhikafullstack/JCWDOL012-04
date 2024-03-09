import { ChangeNameDialog } from "@/components/profile/change-name"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useAuth } from "@/lib/store/auth/auth.provider"
import ChangeEmailDialog from "./change-email"

export default function TabAccount() {
    const user = useAuth()?.user?.data

    return (
        <>
            <TabsContent value="account" >
                <Card>
                    <CardHeader>
                        <CardTitle>{`Hi, ${user?.firstName ? `${user.firstName}!` : "..."}`}</CardTitle>
                        <CardDescription>
                            Make changes to your account here.
                        </CardDescription>
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
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}