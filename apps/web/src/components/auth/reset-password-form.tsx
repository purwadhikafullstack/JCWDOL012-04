"use client"

import { useAuth } from "@/lib/store/auth/auth.provider"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import Link from "next/link"

export default function ResetPasswordForm() {
    const auth = useAuth()
    const error = auth?.error

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address format')
                .required('Email is required')
        }),
        onSubmit: async (values) => {
            await auth?.resetPassword.initChangeRequest(values)
            formik.setSubmitting(false)
        },
    })

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your email address to reset your password.</CardDescription>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email:</Label>
                                <Input
                                    name="email"
                                    placeholder="Type your email"
                                    type="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>
                            {formik.errors.email && formik.touched.email && (
                                <div className="mt-1 text-red-500 text-xs md:text-sm">{formik.errors.email}</div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" aria-disabled={auth?.isLoading || formik.isSubmitting} className="w-full">Reset Password</Button>
                        {error && error.status && (
                            <div className="flex flex-col gap-2">
                                <span className="text-red-600 text-sm">{error.message}</span>
                                {error?.code === -1 ? <Link className="bold text-purple-800 text-sm italic" href={'/auth/register'}>Go to Registration Page →</Link> : null}
                            </div>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </>
    )
}