'use client'

import { PiArrowRightBold, PiAt, PiKey, PiSealWarningLight } from "react-icons/pi";

import { Button, GoogleLoginButton } from '../ui/button-c';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import LineWithText from "../ui/line";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function LoginForm() {
    const origin = useSearchParams().get('origin')
    const auth = useAuth()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
        }),
        onSubmit: (values) => {
            auth?.logIn(values)
        },
    })

    return (
        <div className="flex-1 rounded-lg bg-purple-50 px-6 py-8 ">
            <form onSubmit={formik.handleSubmit} className="space-y-3">
                <h1 className="mb-9 text-2xl text-center">
                    Login To Your Account
                </h1>
                {origin === 'verify-email' && (
                    <div className='rounded-md bg-purple-300 p-4 text-center'>
                        <p >
                            Congratulations! Your account is verified. Please login to continue.
                        </p>
                    </div>
                )}
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
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
                                required
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
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <PiKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="flex items-center mt-2 text-red-500">
                                <PiSealWarningLight className="h-5 w-5 mr-2" />
                                <span>{formik.errors.password}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
                <LoginButton isDisabled={auth?.isLoading!} />
                {auth?.error.status
                    ? (
                        <div className="flex items-center mt-2 text-red-500">
                            <PiSealWarningLight className="h-5 w-5 mr-2" />
                            <span>{auth.error.message}</span>
                        </div>
                    ) : null}
            </form>
            <LineWithText text="or" />
            <GoogleLoginButton />
            <div className="mt-4">
                Don't have an account?{' '}
                <Link className="bold text-purple-800" href="/auth/register">
                    Create one
                </Link>
            </div>
        </div>
    );
}

function LoginButton({ isDisabled }: { isDisabled: boolean }) {
    return (
        <Button className="mt-4 w-full px-3 text-left" aria-disabled={isDisabled} type='submit'>
            Log in <PiArrowRightBold className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}
