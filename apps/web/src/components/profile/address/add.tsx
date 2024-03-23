"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from "@/components/ui/spinner"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useAddress } from "@/lib/store/address/address.provider"

export function AddAddress() {
    const auth = useAuth()
    const address = useAddress()
    const { provinces, cities } = address.data

    const formik = useFormik({
        initialValues: {
            label: '',
            address: '',
            isPrimaryAddress: false,
            provinceId: '',
            cityId: '',
            latitude: '',
            longitude: ''
        },
        validationSchema: Yup.object({
            label: Yup.string()
                .min(2, 'Must be 2 characters or more')
                .required('Label is required'),
            address: Yup.string()
                .min(10, 'Must be 10 characters or more')
                .required('Address detail is required'),
            isPrimaryAddress: Yup.boolean()
                .required('Primary address is required'),
            cityId: Yup.number()
                .required('Required'),
            provinceId: Yup.string()
                .required('Required')

        }),
        onSubmit: async (values) => {
            await address.addAddress(values)
        }
    })

    useEffect(() => { address.getProvinces() }, [])
    useEffect(() => { formik.values.provinceId && address.getCities(formik.values.provinceId) }, [formik.values.provinceId])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" disabled={auth?.isLoading} className="text-xs sm:text-sm">New Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                    <DialogDescription>
                        Add your new address. Click Save when you're done.
                    </DialogDescription>
                </DialogHeader>
                {!auth?.isLoading &&
                    (<form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="label" >
                                    Label
                                </Label>
                                <Input
                                    name="label"
                                    type="text"
                                    value={formik.values.label}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="E.g. Home, Office, Apartment, etc."
                                    className="col-span-3"
                                />
                                {formik.errors.label && formik.touched.label
                                    ? (<div className="col-span-4 text-red-500 text-xs">{formik.errors.label}</div>)
                                    : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="provinceId" >Province</Label>
                                <Select
                                    name="provinceId"
                                    value={formik.values.provinceId}
                                    onValueChange={(e) => {
                                        formik.setFieldValue('provinceId', e.toString())
                                        formik.setFieldValue('cityId', '')
                                    }}
                                >
                                    <SelectTrigger className="col-span-3 ">
                                        <SelectValue placeholder="Select a province" />
                                    </SelectTrigger>
                                    <SelectContent  >
                                        <SelectGroup>
                                            {provinces.map((province, index) =>
                                                <SelectItem key={index} value={province.id.toString()} >{province.name}</SelectItem>
                                            )}
                                        </SelectGroup >
                                    </SelectContent>
                                </Select>
                                {formik.errors.provinceId && formik.touched.provinceId ? (<div className="text-red-500 text-xs">{formik.errors.provinceId}</div>) : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cityId" >City</Label>
                                <Select
                                    name="cityId"
                                    value={formik.values.cityId}
                                    onValueChange={(e) => formik.setFieldValue('cityId', e.toString())}
                                    disabled={!formik.values.provinceId}
                                >
                                    <SelectTrigger className="col-span-3 ">
                                        <SelectValue placeholder={cities.length ? "Select a city or district" : "Select a province first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {cities.map((city, index) =>
                                                <SelectItem key={index} value={city.id.toString()} >{city.type === "KABUPATEN" ? `${city.name} (Kab.)` : city.name}</SelectItem>
                                            )}
                                        </SelectGroup >
                                    </SelectContent>
                                </Select>
                                {formik.errors.cityId && formik.touched.cityId ? (<div className="text-red-500 text-xs">{formik.errors.cityId}</div>) : null}
                            </div>
                            <div className="flex flex-col items-start gap-4">
                                <Label htmlFor="address" >Address Details</Label>
                                <Textarea
                                    name="address"
                                    placeholder="Type more address details"
                                    defaultValue={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.address && formik.touched.address ? (<div className="text-red-500 text-xs">{formik.errors.address}</div>) : null}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4 flex-wrap">
                                <Label htmlFor="isPrimaryAddress" >Primary Address?</Label>
                                <div className="col-span-3 flex items-center gap-2 ">
                                    <input
                                        name="isPrimaryAddress"
                                        type="checkbox"
                                        checked={formik.values.isPrimaryAddress}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <p className="text-xs">{formik.values.isPrimaryAddress ? "Yes, make it my primary address." : "No, don't make it my primary address"}</p>
                                </div>
                            </div>
                            <div>
                                {auth?.error?.status
                                    ? (<div className="text-red-500 text-xs">
                                        {auth.error?.message ? auth.error?.message : 'An Error occured. Something went wrong'}
                                    </div>)
                                    : null}
                            </div>

                            <DialogFooter>
                                {auth?.isLoading || address.isLoading && (<div className="mx-auto"><Spinner /></div>)}
                                <Button type="submit" disabled={auth?.isLoading || address.isLoading} >Save</Button>
                            </DialogFooter>
                        </div>
                    </form>)}
            </DialogContent>
        </Dialog >
    )
}