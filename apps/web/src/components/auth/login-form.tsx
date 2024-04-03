'use client'

import { PiArrowRightBold, PiAt, PiKey, PiSeal, PiSealWarning, PiSealWarningLight } from "react-icons/pi";
import { Button, GoogleLoginButton } from '../ui/button-c';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import LineWithText from "../ui/line";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { PiSealCheck } from "react-icons/pi";
import { Alert, AlertDescription } from "../ui/alert";

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
                <h1 className="mb-6 text-2xl text-center">
                    Login To Your Account
                </h1>
                <LoginBanner origin={origin} />
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
                {auth?.error?.status && auth.error?.status !== 401
                    ? (
                        <div className="flex items-center mt-2 text-red-500">
                            <PiSealWarningLight className="h-5 min-w-5 mr-2" />
                            <span>{auth.error.message}</span>
                        </div>
                    ) : null}
            </form>
            <LineWithText text="or" />
            <GoogleLoginButton />
            <div className="mt-4 text-sm">
                <div>
                    <span>{`Don't have an account? `}</span>
                    <Link className="bold text-purple-800" href="/auth/register">
                        Create one
                    </Link>
                </div>
                <div>
                    <span>{`Forgot password? `}</span>
                    <Link className="bold text-purple-800" href="/auth/reset-password">
                        Reset password
                    </Link>
                </div>
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

function LoginBanner({ origin }: { origin: string | null }) {
    if (!origin) return null

    if (origin === 'verify-email') return (
        <Alert className=" border-purple-800">
            <PiSealCheck className="h-5 w-5 mr-2 " />
            <AlertDescription>Congratulations! Your account is now verified. Please login to continue.</AlertDescription>
        </Alert>
    )

    if (origin === '401') return (
        <Alert variant={'destructive'} >
            <PiSealWarning className="h-5 w-5 mr-2 " />
            <AlertDescription>Your session is invalid or has expired. Please log in.</AlertDescription>
        </Alert>
    )

    if (origin === 'change-email-success') return (
        <Alert className=" border-purple-800">
            <PiSealCheck className="h-5 w-5 mr-2 " />
            <AlertDescription>Your email has been successfully changed. Please login to continue.</AlertDescription>
        </Alert>
    )

    if (origin === 'reset-password-success') return (
        <Alert className=" border-purple-800">
            <PiSealCheck className="h-5 w-5 mr-2 " />
            <AlertDescription>Your password has been successfully updated. Please login with your new password to continue.</AlertDescription>
        </Alert>
    )
    return null
}