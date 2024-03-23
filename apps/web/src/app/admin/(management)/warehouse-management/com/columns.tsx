"use client"

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TWarehouse>[] = [
    {
        accessorKey: "name",
        header: "WH Name",
    },
    {
        accessorKey: "city",
        header: "City/District",
        cell: ({ row }) => {
            const city = row.getValue("city")! as { name: string, type: string }
            return (<div className="capitalize">{city.type === 'KABUPATEN' ? "Kab." : city.type === "KOTA" ? "Kota" : null} {city.name}</div>)
        }
    },
    {
        accessorKey: "address",
        header: "Address"
    },
    {
        accessorKey: "warehouseAdmin",
        header: "Admin",
        cell: ({ row }) => {
            const whAdmin = row.getValue("warehouseAdmin")! as { firstName: string }[]
            return (
                <div className="capitalize">
                    {!whAdmin.length && <p className="italic text-red-500">{"No admin assigned"}</p>}
                    {whAdmin.length
                        ? whAdmin.map((admin, index) => {
                            return (
                                index === whAdmin.length - 1
                                    ? admin.firstName
                                    : `${admin.firstName}, `
                            )
                        })
                        : null}
                </div>
            )
        }
    },
]

