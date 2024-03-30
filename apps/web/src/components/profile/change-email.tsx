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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from "../ui/spinner"
import { useEffect, useState } from "react"

export default function ChangeEmailDialog() {
    const auth = useAuth()
    const [dialogOpen, setDialogOpen] = useState(false)

    const formik = useFormik({
        initialValues: {
            password: '',
            newEmail: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('Current password is required'),
            newEmail: Yup.string()
                .email('Invalid email address')
                .required('Type your new email address')
        }),
        onSubmit: async (values) => {
            await auth?.changeEmail(values)
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
                <Button variant="outline" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Email</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Email</DialogTitle>
                    <DialogDescription>
                        {"We will send an instruction to your new email to complete your changes. Type your password and new email, and then click submit when you're done."}
                    </DialogDescription>
                </DialogHeader>
                {auth?.isLoading && <div className="mx-auto"><Spinner /></div>}
                {!auth?.isLoading &&
                    (<form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" >
                                Password
                            </Label>
                            <Input
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your password"
                                className="col-span-3"
                            />
                            {formik.errors.password && formik.touched.password
                                ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.password}</div>)
                                : null}
                        </div>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newEmail" >
                                    New Email
                                </Label>
                                <Input
                                    name="newEmail"
                                    value={formik.values.newEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your new email address"
                                    className="col-span-3"
                                />
                                {formik.errors.newEmail && formik.touched.newEmail
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.newEmail}</div>)
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

                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={formik.isSubmitting || auth?.isLoading}>Submit</Button>
                            </DialogFooter>
                        </div>
                    </form>)}
            </DialogContent>
        </Dialog>
    )
}
