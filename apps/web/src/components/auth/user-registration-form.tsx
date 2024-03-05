"use client"
import Link from "next/link";
import { useFormik } from "formik";
import { userRegistrationValidationSchema } from "./validation";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { registerUserWithEmail } from "@/app/services/auth";
import { PiArrowRightBold, PiAt, PiSealWarningLight } from "react-icons/pi";
import { Button } from "../ui/button";
import { GoogleLoginButton } from "../ui/button";
import LineWithText from "../ui/line";

export default function UserRegistrationForm() {
    const [response, setResponse] = useState<null | AxiosResponse | undefined>(null)

    useEffect(() => {
        if (!response?.status) return
        if (response?.status === 201) {
            console.log('User registered successfully')
        }
        if (response?.status === 422) {
            console.log(response)
            console.log('Email is in use')
        }
        console.log('something is wrong and left unhandled')
    }, [response])

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validationSchema: userRegistrationValidationSchema,
        onSubmit: (values) => {
            registerUserWithEmail(values, setResponse, formik.setSubmitting)
        },
    })

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="space-y-3">
                <div className="flex01 rounded-lg bg-purple-50 px-6 pb-4 pt-8">
                    <h1 className="mb-3 text-2xl text-center">
                        Create An Account
                    </h1>

                    <div className="w-full">
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="firstName"
                            >
                                First Name
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstName}
                                />
                            </div>
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="flex items-center mt-2 text-red-500">
                                    <PiSealWarningLight className="h-5 w-5 mr-2" />
                                    <span>{formik.errors.firstName}</span>
                                </div>
                            ) : null}
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 block text-xs font-medium text-gray-900"
                                htmlFor="lastName"
                            >
                                Last Name
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                />
                            </div>
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <div className="flex items-center mt-2 text-red-500">
                                    <PiSealWarningLight className="h-5 w-5 mr-2" />
                                    <span>{formik.errors.lastName}</span>
                                </div>
                            ) : null}
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 block text-xs font-medium text-gray-900"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                <PiAt className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="flex items-center mt-2 text-red-500">
                                    <PiSealWarningLight className="h-5 w-5 mr-2" />
                                    <span>{formik.errors.email}</span>
                                </div>
                            ) : null}
                        </div>

                        <Button className="mt-4 w-full px-3" disabled={formik.isSubmitting} type='submit'>
                            Sign Me Up <PiArrowRightBold className="ml-auto h-5 w-5 text-gray-50" />
                        </Button>

                        <LineWithText text="or" />
                        <GoogleLoginButton text="Sign Up With Google" />

                        <div className="mt-4">
                            Have an account?{' '}
                            <Link className="bold text-purple-800" href="/auth/login">
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}