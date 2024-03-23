"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteWarehouseAdminDialog from "./dialog-delete";
import EditAdminDialog from "./dialog-edit";

export const columns: ColumnDef<AdminModel>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
            const gender = row.getValue("gender")! as string
            return (<div className="capitalize">{gender}</div>)
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const admin = row.original

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
                        <EditAdminDialog id={admin?.id!} />
                        <DeleteWarehouseAdminDialog id={admin?.id!} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]