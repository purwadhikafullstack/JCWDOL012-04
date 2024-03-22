"use client"

import { useAuth } from "@/lib/store/auth/auth.provider"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

export default function ResetPasswordForm() {
    const auth = useAuth()

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address format')
                .required('Email is required')
        }),
        onSubmit: (values) => {
            auth?.resetPassword.initChangeRequest(values)
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
                    <CardFooter className="flex flex-wrap gap-2 w-full">
                        {auth?.error && auth.error.status && (
                            <p className="text-red-600 text-sm">{auth.error.message}</p>
                        )}
                        <Button type="submit" aria-disabled={auth?.isLoading} className="w-full" >Reset Password</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    )
}