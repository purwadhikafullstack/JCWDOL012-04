"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from "../ui/spinner"
import { useEffect, useState } from "react"

export default function ChangeProfilePictDialog() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const auth = useAuth()
    const user = useAuth()?.user?.data
    const SUPPORTED_FORMATS = "image/jpeg, image/png, image/gif, image/jpg"
    const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

    const formik = useFormik({
        initialValues: {
            file: {} as File
        },
        validationSchema: Yup.object({
            file: Yup.mixed()
                .required('Please choose a file')
                .test('fileFormat', 'Unsupported file format. Only accept JPG, JPEG, PNG, and GIF file.', (value) => value && SUPPORTED_FORMATS.includes((value as File).type))
                .test('fileSize', 'File size too large. Must be under 1 MB.', (value) => value && (value as File).size <= MAX_FILE_SIZE)
        }),
        onSubmit: async (values: { file: File }) => {
            await auth?.updateProfilePicture(values)
            formik.setSubmitting(false)
        }
    })

    useEffect(() => { if (dialogOpen) formik.resetForm() }, [dialogOpen])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button variant="outline" disabled={auth?.isLoading} className="text-xs sm:text-sm">Change Picture</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Profile Picture</DialogTitle>
                    <DialogDescription>
                        Choose your new profile picture file, and then click Save Changes when you're done.
                    </DialogDescription>
                </DialogHeader>
                {auth?.isLoading && <div className="mx-auto"><Spinner /></div>}
                {!auth?.isLoading &&
                    (<form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="file" >
                                    Picture
                                </Label>
                                <Input
                                    name="file"
                                    type="file"
                                    accept="image/jpeg, image/png, image/gif, image/jpg"
                                    onChange={(event) => {
                                        formik.setFieldValue("file", event.currentTarget.files![0])
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="col-span-3"
                                />
                            </div>
                            {formik.errors.file && formik.touched.file
                                ? (<div className=" text-red-500 text-xs">{formik.errors.file as string} </div>)
                                : null}
                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={Boolean(formik.errors.file) || auth?.isLoading || formik.isSubmitting}>Save Changes</Button>
                            </DialogFooter>
                        </div>
                    </form>)}
            </DialogContent>
        </Dialog>
    )
}
