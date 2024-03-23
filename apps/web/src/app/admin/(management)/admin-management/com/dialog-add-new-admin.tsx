"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import { addNewAdminValidationSchema, submitAddNewAdmin } from "./validation-action"
import { useState } from "react"

export type AddAdminError = {
    status: number | undefined | null
    message: string | undefined | null
} | null

export default function DialogAddNewAdmin() {
    const [error, setError] = useState<AddAdminError>(null)

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            gender: undefined,
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: addNewAdminValidationSchema,
        onSubmit: async (values) => {
            await submitAddNewAdmin(values, setError);
            formik.setSubmitting(false);
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-xs sm:text-sm">+ New Admin</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Warehouse Administrator</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                onBlur={formik.handleBlur}
                                placeholder="Enter first name"
                                className="col-span-3"
                            />
                            {formik.errors.firstName && formik.touched.firstName
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.firstName}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.lastName}
                                onBlur={formik.handleBlur}
                                placeholder="Enter last name"
                                className="col-span-3"
                            />
                            {formik.errors.lastName && formik.touched.lastName
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.lastName}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                name="gender"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gender}
                                placeholder="Select a gender"
                                className="col-span-3 rounded-sm border-gray-200"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {formik.errors.gender && formik.touched.gender
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.gender}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                                placeholder="Enter email address"
                                className="col-span-3"
                            />
                            {formik.errors.email && formik.touched.email
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.email}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                placeholder="Enter password"
                                className="col-span-3"
                            />
                            {formik.errors.password && formik.touched.password
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.password}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                onChange={formik.handleChange}
                                value={formik.values.confirmPassword}
                                onBlur={formik.handleBlur}
                                placeholder="Retype password"
                                className="col-span-3"
                            />
                            {formik.errors.confirmPassword && formik.touched.confirmPassword
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.confirmPassword}</div>)
                                : null}
                        </div>
                        <DialogFooter>
                            {error?.status && <p className="text-red-500 text-xs">{error?.message}</p>}
                            <Button type="submit" disabled={formik.isSubmitting}>Submit</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}