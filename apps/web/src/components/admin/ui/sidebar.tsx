"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiHouse, PiUser, PiUserGear, PiWarehouse, PiArchive } from "react-icons/pi";

const links = [
    { name: "Home", href: "/admin", icon: PiHouse },
    { name: "Administrator", href: "/admin/admin-management", icon: PiUser },
    { name: "Customer", href: "/admin/customer-management", icon: PiUserGear },
    { name: "Warehouse", href: "/admin/warehouse-management", icon: PiWarehouse },
    { name: "Products", href: "/admin/products", icon: PiArchive },
]

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <div className="flex flex-col space-y-2">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                                {
                                    'bg-sky-100 text-blue-600': pathname === link.href,
                                })}
                        >
                            <LinkIcon />
                            <p className="capitalize block">{link.name}</p>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}
