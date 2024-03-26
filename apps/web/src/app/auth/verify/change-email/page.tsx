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

export default function VerifyChangeEmailPage() {
    const auth = useAuth()
    const tokenQuery = useSearchParams().get('token')
    if (!tokenQuery) notFound()

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Must be 6 characters or more')
                .required('Current password is required'),
        }),
        onSubmit: async (values) => {
            await auth?.updateEmail(values, tokenQuery)
            formik.setSubmitting(false)
        }
    })
    return (
        <>
            <div className="min-h-[80vh] w-full px-3">
                <Card className="mt-12 sm:max-w-screen-md sm:mx-auto">
                    <CardHeader className="gap-5">
                        <div className="flex gap-5 items-center">
                            <CardTitle>Change Your Email</CardTitle>
                            {auth?.isLoading ? <Spinner /> : null}
                        </div>
                        <CardDescription>One more step to change your email. Please provide your password and then click Save Changes to save your changes.</CardDescription>
                    </CardHeader>

                    <CardContent >
                        <form onSubmit={formik.handleSubmit}>
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
                                    disabled={auth?.isLoading}
                                    placeholder="Enter your password"
                                    className="col-span-3"
                                />
                                {formik.errors.password && formik.touched.password
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.password}</div>)
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
                                <Button type="submit" disabled={auth?.isLoading || formik.isSubmitting} > Submit</Button>
                            </DialogFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}