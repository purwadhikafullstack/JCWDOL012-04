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
import { Separator } from "@radix-ui/react-separator"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from "../ui/spinner"
import { useEffect, useState } from "react"

export function ChangePasswordDialog() {
    const auth = useAuth()
    const [dialogOpen, setDialogOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            retypeNewPassword: ''
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('Current password is required'),
            newPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('Type your new password'),
            retypeNewPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .oneOf([Yup.ref('currentPassword')], 'New password cannot be the same as the current password')
                .required('Retype your new password')
        }),
        onSubmit: async (values) => {
            await auth?.changePassword(values)
            formik.setSubmitting(false)
        }
    })

    useEffect(() => {
        formik.resetForm()
        auth.clearError()
    }, [dialogOpen])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button variant="outline" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        {"Change your password here. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                {auth?.isLoading && <div className="mx-auto"><Spinner /></div>}
                {!auth?.isLoading &&
                    (<form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="currentPassword" >
                                    Current Password
                                </Label>
                                <Input
                                    name="currentPassword"
                                    type="password"
                                    value={formik.values.currentPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your current password"
                                    className="col-span-3"
                                />
                                {formik.errors.currentPassword && formik.touched.currentPassword
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.currentPassword}</div>)
                                    : null}
                            </div>
                            <Separator className="my-2 border-t-[1px]" decorative />
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newPassword" >
                                    New Password
                                </Label>
                                <Input
                                    name="newPassword"
                                    type="password"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your new password"
                                    className="col-span-3"
                                />
                                {formik.errors.newPassword && formik.touched.newPassword
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.newPassword}</div>)
                                    : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="retypeNewPassword" >
                                    Retype New Password
                                </Label>
                                <Input
                                    name="retypeNewPassword"
                                    type="password"
                                    value={formik.values.retypeNewPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Retype your new password"
                                    className="col-span-3"
                                />
                                {formik.errors.retypeNewPassword && formik.touched.retypeNewPassword
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.retypeNewPassword}</div>)
                                    : null}
                            </div>
                            <div>
                                {auth?.error?.status
                                    ? (<div className="text-red-500 text-xs">
                                        {auth.error?.message
                                            ? auth.error?.message
                                            : 'An Error occured. Something went wrong'}
                                    </div>)
                                    : null}
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={formik.isSubmitting || auth?.isLoading} >Save Changes</Button>
                            </DialogFooter>
                        </div>
                    </form>)}
            </DialogContent>
        </Dialog>
    )
}
