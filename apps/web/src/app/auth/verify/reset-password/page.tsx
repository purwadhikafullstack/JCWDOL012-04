"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from "@/components/ui/spinner"
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import UnauthorizedPage from "@/components/auth/unauthorized";

export default function VerifyChangeEmailPage() {
    const auth = useAuth()
    const tokenQuery = useSearchParams().get('token')
    if (!tokenQuery) notFound()
    console.log(auth.user)

    useEffect(() => { auth?.resetPassword.verifyRequest(tokenQuery) }, [])

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            retypeNewPassword: ''
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('New password is required'),
            retypeNewPassword: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Retype your new password')
        }),
        onSubmit: async (values) => {
            auth.clearError()
            await auth?.resetPassword.setNewPassword({ newPassword: values.newPassword }, tokenQuery)
            formik.setSubmitting(false)
        }
    })

    if (!auth?.user.data?.id && !auth?.isLoading) return (
        < UnauthorizedPage message={auth?.error?.message!} ctaLabel="Go To Home Page" redirectTo="/" />
    )

    if (auth?.user.data?.id && !auth.isLoading) return (
        <div className="min-h-[80vh] w-full px-3">
            <Card className="mt-12 sm:max-w-screen-md sm:mx-auto">
                <CardHeader className="gap-5">
                    <div className="flex gap-5 items-center">
                        <CardTitle>Reset Your Password</CardTitle>
                        {auth?.isLoading ? <Spinner /> : null}
                    </div>
                    <CardDescription>{"One more step to reset your password. Please provide your new password and then click Save Changes when you're done."}</CardDescription>
                </CardHeader>

                <CardContent >
                    <form onSubmit={formik.handleSubmit}>
                        <div className="sm:grid sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="newPassword" >
                                New Password
                            </Label>
                            <Input
                                name="newPassword"
                                type="password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={auth?.isLoading}
                                placeholder="Enter your new password"
                                className="sm:col-span-3"
                            />
                            {formik.errors.newPassword && formik.touched.newPassword
                                ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.newPassword}</div>)
                                : null}
                        </div>
                        <div className="sm:grid sm:grid-cols-4 items-center gap-4 mt-4">
                            <Label htmlFor="retypeNewPassword" >
                                Retype New Password
                            </Label>
                            <Input
                                name="retypeNewPassword"
                                type="password"
                                value={formik.values.retypeNewPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={auth?.isLoading}
                                placeholder="Retype your new password"
                                className="sm:col-span-3"
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

                        <DialogFooter className="mt-4 gap-3 flex flex-col">
                            <Button type="submit" disabled={auth?.isLoading || formik.isSubmitting} > Save Changes</Button>
                        </DialogFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

    if (auth?.isLoading) return (
        <main className="flex items-center justify-center h-screen ">
            <Spinner />
        </main>
    )
}