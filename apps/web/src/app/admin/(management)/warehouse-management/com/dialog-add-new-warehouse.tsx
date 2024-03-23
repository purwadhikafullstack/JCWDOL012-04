"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import { addNewWarehouseValidationSchema, getProvinces, initialValues, getCitiesOfProvince, getIdleAdmins, createWarehouse } from "./validation-action"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProvincesModel } from "@/model/ProvincesModel"
import { CitiesModel } from "@/model/CitiesModel"
import { Textarea } from "@/components/ui/textarea"
import Maps, { LatLng } from "@/components/profile/address/maps"
import { PiWarning } from "react-icons/pi"

export default function AddNewWarehouseDialog() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [error, setError] = useState<TWarehouseError>(null)
    const [RawLatLng, setRawLatLng] = useState<LatLng>({ lat: - 6.175211007317426, lng: 106.82715358395524 })
    const [provinces, setProvinces] = useState<ProvincesModel[] | null>(null)
    const [cities, setCities] = useState<CitiesModel[] | null>(null)
    const [admins, setAdmins] = useState<AdminModel[] | null>(null)

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: addNewWarehouseValidationSchema,
        onSubmit: async (values) => {
            await createWarehouse(values, setError)
            formik.setSubmitting(false)
        },
    });

    useEffect(() => {
        if (dialogOpen) {
            getProvinces(setProvinces, setError)
            getIdleAdmins(setAdmins, setError)
        }
    }, [dialogOpen])

    function setPinpoint() {
        formik.setFieldValue('latitude', RawLatLng.lat.toString())
        formik.setFieldValue('longitude', RawLatLng.lng.toString())
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button className="text-xs sm:text-sm">+ New Warehouse</Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-[90vw] sm:max-w-[75vw] overflow-y-scroll max-h-[90vh]"
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
                    <DialogTitle>Add New Warehouse</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name">Warehouse Name</Label>
                            <Input
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                                placeholder="Enter warehouse name"
                                className="col-span-3"
                            />
                            {formik.errors.name && formik.touched.name
                                ? (<div className="col-start-2 col-span-3 text-red-500 text-xs">{formik.errors.name}</div>)
                                : null}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="provinceId" >Province</Label>
                            <Select
                                name="provinceId"
                                defaultValue={formik.values.provinceId}
                                onValueChange={async (e) => {
                                    formik.setFieldValue('provinceId', e.toString())
                                    await getCitiesOfProvince(e.toString(), setCities, setError)
                                    formik.setFieldValue('cityId', '')
                                }}
                            >
                                <SelectTrigger className="col-span-3 ">
                                    <SelectValue placeholder="Select a province" />
                                </SelectTrigger>
                                <SelectContent  >
                                    {provinces && provinces.map((province, index) =>
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
                                    <SelectValue placeholder={cities && cities.length ? "Select a city or district" : "Select a province first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities && cities
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
                        <div className="text-xs text-gray-500">Search or drag the marker to pinpoint your address. Click Set Pinpoint when you're done.</div>
                        <div className="h-[256px] w-full">
                            <Maps onMarkerUpdated={setRawLatLng} />
                        </div>
                        <Button variant={'outline'} onClick={(e) => {
                            setPinpoint()
                            e.preventDefault()
                        }}>Set Pinpoint</Button>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adminId" >Assign Admin</Label>
                            <Select
                                name="adminId"
                                value={formik.values.adminId}
                                onValueChange={(e) => formik.setFieldValue('adminId', e.toString())}
                                disabled={!admins || !admins.length}
                            >
                                <SelectTrigger className="col-span-3 ">
                                    <SelectValue placeholder="Select an administrator" />
                                </SelectTrigger>
                                <SelectContent>
                                    {admins && admins
                                        .map((admin, index) =>
                                            <SelectItem
                                                key={index}
                                                value={admin?.id?.toString()!}
                                                className="capitalize"
                                            >
                                                {`${admin.firstName} ${admin.lastName}`}
                                            </SelectItem>
                                        )}
                                </SelectContent>
                            </Select>
                            {admins && !admins.length &&
                                <div className="flex items-center gap-3 col-start-2 col-span-3 text-red-600 ">
                                    <PiWarning size={24} className="min-w-fit" />
                                    <p className="text-gray-800 italic text-xs sm:text-sm">No available admin. You can set it later once there is an idle one.</p>
                                </div>}
                            {formik.errors.adminId && formik.touched.adminId ? (<div className="text-red-500 text-xs">{formik.errors.adminId}</div>) : null}
                        </div>

                        <DialogFooter>
                            {error?.status && <p className="text-red-500 text-xs">{error?.message}</p>}
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                            >Submit</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}