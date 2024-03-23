"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function DialogAddNewAdmin() {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, "Must be at least 6 characters")
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .min(6, "Must be at least 6 characters")
                .required('Required')
        }),
        onSubmit: values => {
            console.log(values);
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-xs sm:text-sm">Add New Admin</Button>
            </DialogTrigger>
            <DialogTitle>Add New Warehouse Administrator</DialogTitle>
            <DialogContent>
                <DialogDescription>
                    <form onSubmit={formik.handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                        />
                        <DialogFooter>
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}