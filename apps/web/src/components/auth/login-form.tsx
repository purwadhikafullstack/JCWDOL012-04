'use client'

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';
import { authenticate, clientSideRedirect, login } from '@/app/lib/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

export default function LoginForm() {
    const [response, setResponse] = useState<null | AxiosResponse>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<undefined | boolean>(undefined)

    useEffect(() => {
        if (response?.status === 200 && response?.data.code === 1) clientSideRedirect('/')
        console.log(isAuthenticated)

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
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl">
                    Login To Your Account
                </h1>
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
                    </div>
                </div>
                <LoginButton isSubmitting={formik.isSubmitting} />
                {/* <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    ) || null}
                </div> */}
            </div>
        </form>
    );
}

function LoginButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button className="mt-4 w-full px-3" aria-disabled={isSubmitting} type='submit'>
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    );
}