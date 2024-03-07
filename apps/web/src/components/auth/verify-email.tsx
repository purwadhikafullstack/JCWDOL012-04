"use client"

import { useFormik } from "formik";
import { setPasswordValidationSchema } from "./validation";
import { PiArrowRightBold, PiSealWarningLight } from "react-icons/pi";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function VerifySetPassword({ token }: { token: string }) {
    const auth = useAuth()

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: setPasswordValidationSchema,
        onSubmit: (values) => {
            auth?.setPassword(values, token, '/auth/login?origin=verify-email')
        },
    })

    return (
        <>
            <main className="flex items-center justify-center my-16 md:my-0 md:h-screen ">
                <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                    <form onSubmit={formik.handleSubmit} className="space-y-3">
                        <div className="flex01 rounded-lg bg-purple-50 px-6 pb-4 pt-8">
                            <h1 className="mb-3 text-2xl text-center">
                                {`One more step, ${auth?.user?.data?.firstName}!`}
                            </h1>
                            <p className="text-center">
                                Set your password to complete your registration.
                            </p>
                            <div className="w-full">
                                <div>
                                    <label
                                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                        htmlFor="firstName"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                        />
                                    </div>
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="flex items-center mt-2 text-red-500">
                                            <PiSealWarningLight className="h-5 w-5 mr-2" />
                                            <span>{formik.errors.password}</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="mt-4">
                                    <label
                                        className="mb-3 block text-xs font-medium text-gray-900"
                                        htmlFor="lastName"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Retype your password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.confirmPassword}
                                        />
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="flex items-center mt-2 text-red-500">
                                            <PiSealWarningLight className="h-5 min-w-5 mr-2" />
                                            <span>{formik.errors.confirmPassword}</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <Button className="mt-4 w-full px-3" disabled={auth?.isLoading!} type='submit'>
                                        Complete Registration <PiArrowRightBold className="ml-auto h-5 w-5 text-gray-50" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}