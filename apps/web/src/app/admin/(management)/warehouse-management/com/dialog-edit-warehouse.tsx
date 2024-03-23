"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import { addNewWarehouseValidationSchema, getProvinces, initialValues, getCitiesOfProvince, getIdleAdmins, createWarehouse, getWhById, validateChangesOnEdit, updateWarehouse } from "./validation-action"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProvincesModel } from "@/model/ProvincesModel"
import { CitiesModel } from "@/model/CitiesModel"
import { Textarea } from "@/components/ui/textarea"
import Maps, { LatLng } from "@/components/profile/address/maps"
import { PiWarning } from "react-icons/pi"
import { Badge } from "@/components/ui/badge"

export default function EditWarehouseDialog({ id }: { id: string | number }) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [error, setError] = useState<TWarehouseError>(null)
    const [RawLatLng, setRawLatLng] = useState<LatLng>({ lat: - 6.175211007317426, lng: 106.82715358395524 })
    const [provinces, setProvinces] = useState<ProvincesModel[] | null>(null)
    const [cities, setCities] = useState<CitiesModel[] | null>(null)
    const [admins, setAdmins] = useState<AdminModel[] | null>(null)
    const [warehouse, setWarehouse] = useState<TWarehouse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDataReady, setIsDataReady] = useState(false)

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: addNewWarehouseValidationSchema,
        onSubmit: async (values) => {
            await updateWarehouse(id, values, setError)
            formik.setSubmitting(false)
        },
    });

    useEffect(() => {
        if (dialogOpen) {
            setIsLoading(true)
            getWhById(id, setWarehouse, setError)
            getProvinces(setProvinces, setError)
            getIdleAdmins(setAdmins, setError)
        }
        setIsLoading(false)
    }, [dialogOpen])

    useEffect(() => {
        if (dialogOpen && warehouse) {
            (async () => {
                await getCitiesOfProvince(warehouse?.city.provinceId!, setCities, setError)
                setIsDataReady(true)
            })()
        }
    }, [warehouse])

    useEffect(() => {
        if (cities && warehouse && dialogOpen && isDataReady) {
            formik.setValues({
                name: warehouse.name,
                provinceId: warehouse.city.provinceId.toString(),
                cityId: warehouse.city.id.toString(),
                address: warehouse.address,
                latitude: warehouse.latitude.toString(),
                longitude: warehouse.longitude.toString(),
                adminId: warehouse.warehouseAdmin[0]?.id?.toString()
            })
        }
    }, [isDataReady])

    useEffect(() => {
        if (!dialogOpen) {
            setWarehouse(null)
            setProvinces(null)
            setCities(null)
            setAdmins(null)
            setError(null)
            setIsLoading(true)
            setIsDataReady(false)
        }
    }, [dialogOpen])

    function setPinpoint() {
        formik.setFieldValue('latitude', RawLatLng.lat.toString())
        formik.setFieldValue('longitude', RawLatLng.lng.toString())
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button className="text-xs sm:text-sm px-2 text-gray-900 font-normal" variant={'link'}>Edit</Button>
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
                    <DialogTitle>Edit Warehouse</DialogTitle>
                </DialogHeader>
                {isLoading && <p>Loading...</p>}
                {!isLoading && warehouse &&
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
                                    value={formik.values.provinceId}
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
                                    value={String(formik.values.cityId)}
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
                            {parseFloat(warehouse.latitude) ? null : <p className="text-xs text-red-500">Current Pinpoint is not in correct coordinates. Please update it.</p>}
                            <div className="text-xs text-gray-500">Search or drag the marker to pinpoint your address. Click Set Pinpoint when you're done.</div>
                            <div className="h-[256px] w-full">
                                <Maps
                                    onMarkerUpdated={setRawLatLng}
                                    initialCoordinates={{
                                        lat: parseFloat(warehouse.latitude) || -6.175211007317426,
                                        lng: parseFloat(warehouse.longitude) || 106.82715358395524
                                    }}
                                />
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
                                >
                                    <div className="col-span-3 flex gap-3 flex-row justify-end">
                                        <SelectTrigger className="max-w-full">
                                            <SelectValue placeholder="No admin selected" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouse.warehouseAdmin.length
                                                ? <SelectItem value={warehouse.warehouseAdmin[0]?.id.toString()}>
                                                    <Badge className="text-[0.5rem] px-2 h-5 font-light mr-2">Current Admin</Badge>
                                                    {warehouse.warehouseAdmin[0].firstName}
                                                </SelectItem>
                                                : null}

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
                                        {formik.values.adminId && <Button onClick={() => formik.setFieldValue("adminId", "")}>X</Button>}
                                    </div>
                                </Select>
                                {admins && !admins.length &&
                                    <div className="flex items-center gap-3 col-start-2 col-span-3 text-red-600 ">
                                        <PiWarning size={24} className="min-w-fit" />
                                        <p className="text-gray-800 italic text-xs sm:text-sm">No idle admin available.</p>
                                    </div>}
                                {formik.errors.adminId && formik.touched.adminId ? (<div className="text-red-500 text-xs">{formik.errors.adminId}</div>) : null}
                            </div>

                            <DialogFooter className="mt-6">
                                {error?.status && <p className="text-red-500 text-xs">{error?.message}</p>}
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || validateChangesOnEdit(warehouse, formik.values)}
                                >Submit</Button>
                            </DialogFooter>
                        </div>
                    </form>}
                {!isLoading && formik.errors.adminId && formik.touched.adminId ? (<div className="text-red-500 text-xs">{formik.errors.adminId}</div>) : null}
            </DialogContent>
        </Dialog >
    )
}