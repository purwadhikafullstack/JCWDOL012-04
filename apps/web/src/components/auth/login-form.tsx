'use client'

import { PiArrowRightBold, PiGoogleLogoBold } from "react-icons/pi";

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';
import { clientSideRedirect, googleLogin, login } from '@/app/services/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";

export default function LoginForm() {
    const origin = useSearchParams().get('origin')
    const [response, setResponse] = useState<null | AxiosResponse | undefined>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<undefined | boolean>(undefined)

    useEffect(() => {
        if (response?.status === 200 && response?.data.code === 1) {
            clientSideRedirect('/')
            return
        }
    }, [response])

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
            login(values, setResponse, formik.setSubmitting)
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
            <div className="flex-1 rounded-lg bg-purple-50 px-6 pb-4 pt-8">
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
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="flex items-center mt-2 text-red-500">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
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
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="flex items-center mt-2 text-red-500">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                <span>{formik.errors.password}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
                <LoginButton isSubmitting={formik.isSubmitting} />
                {response?.status === 401 || response?.status === 500 || response?.status === 422
                    ? (
                        <div className="flex items-center mt-2 text-red-500">
                            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                            <span>{response.data.message}</span>
                        </div>
                    ) : null}
                <div className="inline-flex items-center justify-center w-full bg-inherit">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-inherit left-1/2">or</span>
                </div>
                <GoogleLoginButton />
                <div className="mt-4">
                    Don't have an account?{' '}
                    <Link className="bold text-purple-800" href="/auth/register">
                        Create one
                    </Link>
                </div>
            </div>
        </form>
    );
}

function LoginButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button className="mt-4 w-full px-3 text-left" aria-disabled={isSubmitting} type='submit'>
            Log in <PiArrowRightBold className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}

function GoogleLoginButton() {
    return (
        <Button className=" w-full px-3 text-left " onClick={googleLogin}>
            Login with Google <PiGoogleLogoBold className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    )
}