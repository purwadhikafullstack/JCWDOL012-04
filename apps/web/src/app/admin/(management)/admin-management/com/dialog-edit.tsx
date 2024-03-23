"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import { editAdminValidationSchema, fetchAdminData, submitAddNewAdmin, submitEditAdmin } from "./validation-action"
import { useState, useEffect } from "react"

export type AddAdminError = {
    status: number | undefined | null
    message: string | undefined | null
} | null

export default function EditAdminDialog({ id }: { id: string | number }) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [error, setError] = useState<AddAdminError>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [adminData, setAdminData] = useState<AdminModel | null>(null)

    useEffect(() => {
        if (dialogOpen) {
            setIsLoading(true)
            fetchAdminData(id, setAdminData, setIsLoading, setError)
            setIsLoading(false)
        }
    }, [dialogOpen])

    useEffect(() => {
        if (adminData) {
            formik.setValues({
                firstName: adminData?.firstName!,
                lastName: adminData?.lastName!,
                gender: adminData?.gender!,
                email: adminData?.email!,
                password: '',
                confirmPassword: ''
            })
        }
    }, [adminData])

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            gender: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: editAdminValidationSchema,
        onSubmit: async (values) => {
            await submitEditAdmin(id, values, setError);
            formik.setSubmitting(false);
        },
    });

    const noChanges =
        formik.values.firstName === adminData?.firstName &&
        formik.values.lastName === adminData?.lastName &&
        formik.values.gender === adminData.gender &&
        formik.values.email === adminData.email &&
        formik.values.password === '' &&
        formik.values.confirmPassword === ''

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="text-xs sm:text-sm px-2 text-gray-900 font-normal" variant={'link'}>Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Warehouse Administrator Account</DialogTitle>
                </DialogHeader>

                {isLoading && <p>Loading...</p>}
                {!isLoading &&
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
                                    placeholder="******"
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
                                    placeholder="******"
                                    className="col-span-3"
                                />
                                {formik.errors.confirmPassword && formik.touched.confirmPassword
                                    ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.confirmPassword}</div>)
                                    : null}
                            </div>
                            <DialogFooter>
                                {error?.status && <p className="text-red-500 text-xs">{error?.message}</p>}
                                <Button type="submit" disabled={formik.isSubmitting || noChanges}>Submit</Button>
                            </DialogFooter>
                        </div>
                    </form>}
            </DialogContent>
        </Dialog>
    )
}