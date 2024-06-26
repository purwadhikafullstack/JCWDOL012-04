"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import Spinner from "@/components/ui/spinner"
import { useAuth } from "@/lib/store/auth/auth.provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useAddress } from "@/lib/store/address/address.provider"
import Maps, { LatLng } from '@/components/profile/address/maps'
import { AddressInitialValues, AddressValidationSchema } from "./fom-validation"

export function AddAddress() {
    const auth = useAuth()
    const address = useAddress()
    const [RawLatLng, setRawLatLng] = useState<LatLng>({ lat: - 6.175211007317426, lng: 106.82715358395524 })
    const { provinces, cities } = address.data
    const [dialogOpen, setDialogOpen] = useState(false)

    const formik = useFormik({
        initialValues: AddressInitialValues,
        validationSchema: AddressValidationSchema,
        onSubmit: async (values) => {
            await address.addAddress(values)
            formik.setSubmitting(false)
        }
    })

    useEffect(() => {
        if (provinces.length > 0) return
        if (provinces.length <= 0) address.getProvinces()
        if (cities.length <= 0) address.getCities()
    }, [])

    useEffect(() => { !dialogOpen && address.clearError() }, [dialogOpen])

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild >
                <Button variant="default" disabled={auth?.isLoading} className="text-xs sm:text-sm">New Address</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[75vw] overflow-y-scroll max-h-[90vh]"
                onInteractOutside={(e) => {
                    const hasPacContainer = e.composedPath().some((el: EventTarget) => {
                        if ("classList" in el) {
                            return Array.from((el as Element).classList).includes("pac-container")
                        }
                        return false
                    })
                    if (hasPacContainer) {
                        e.preventDefault()
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                    <DialogDescription>
                        {"Add your new address. Click Save when you're done."}
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
                                    defaultValue={formik.values.label}
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
                                    defaultValue={formik.values.provinceId}
                                    onValueChange={async (e) => {
                                        formik.setFieldValue('provinceId', e.toString())
                                        formik.setFieldValue('cityId', '')
                                    }}
                                >
                                    <SelectTrigger className="col-span-3 ">
                                        <SelectValue placeholder="Select a province" />
                                    </SelectTrigger>
                                    <SelectContent  >
                                        {provinces.map((province, index) =>
                                            <SelectItem key={index} value={province.id.toString()} >{province.name}</SelectItem>
                                        )}
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
                                        {cities
                                            .filter((city) => city.provinceId === Number(formik.values.provinceId))
                                            .map((city, index) =>
                                                <SelectItem key={index} value={city.id.toString()} >{city.type === "KABUPATEN" ? `${city.name} (Kab.)` : city.name}</SelectItem>
                                            )}
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" >Pinpoint</Label>
                                {formik.values.latitude && formik.values.longitude ? <div className="col-span-3 font-light">{`lat: ${formik.values.latitude}, lng: ${formik.values.longitude}`}</div> : <div className="col-span-3 font-light italic">No Pinpoint set</div>}
                            </div>
                            {formik.errors.latitude && formik.touched.latitude ? (<div className="text-red-500 text-xs">{formik.errors.latitude}</div>) : null}
                            <div className="text-xs text-gray-500">{"Search or drag the marker to pinpoint your address. Click Set Pinpoint when you're done."}</div>
                            <div className="h-[256px] w-full">
                                <Maps onMarkerUpdated={setRawLatLng} />
                            </div>
                            <Button variant={'outline'} onClick={(e) => {
                                setPinpoint()
                                e.preventDefault()
                            }}>Set Pinpoint</Button>

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
                                {address?.error?.status
                                    ? (<div className="text-red-500 text-xs">
                                        {address.error?.message ? address.error?.message : 'An Error occured. Something went wrong'}
                                    </div>)
                                    : null}
                            </div>

                            <DialogFooter>
                                {auth?.isLoading || address.isLoading && (<div className="mx-auto"><Spinner /></div>)}
                                <Button type="submit" className="min-w-[160px]" disabled={auth?.isLoading || address.isLoading || formik.isSubmitting} >Save</Button>
                            </DialogFooter>
                        </div>
                    </form>)}
            </DialogContent>
        </Dialog >
    )

    function setPinpoint() {
        formik.setFieldValue('latitude', RawLatLng.lat.toString())
        formik.setFieldValue('longitude', RawLatLng.lng.toString())
    }
}