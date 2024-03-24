"use client"

import { ColumnDef } from "@tanstack/react-table";

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
        cell: ({ row }) => {
            const email = row.getValue("email")! as string
            const [localPart, domain] = email.split('@');
            const censoredEmail = `${localPart.slice(0, 3)}${'*'.repeat(localPart.length - 3)}@${domain}`;
            return (<div>{censoredEmail}</div>);
        }
    },
]

