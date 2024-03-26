"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import DeleteWarehouseDialog from "./dialog-delete";
import EditWarehouseDialog from "./dialog-edit-warehouse";

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
    {
        id: "actions",
        cell: ({ row }) => {
            const wh = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col items-start">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <EditWarehouseDialog id={wh.id} />
                        <DeleteWarehouseDialog id={wh.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

