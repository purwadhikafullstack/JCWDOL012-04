"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuLinks, superAdminLinks, warehouseAdminLinks } from "@/components/admin/ui/menu-links";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const auth = useAuth();
    const role = auth?.user?.data?.role;
    const [links, setLinks] = useState<MenuLinks | undefined>(undefined);

    useEffect(() => {
        if (!auth?.isLoading && role === 'WAREHOUSE_ADMIN') {
            setLinks(warehouseAdminLinks);
        }
        if (!auth?.isLoading && role === 'SUPER_ADMIN') {
            setLinks(superAdminLinks);
        }
    }, [role])

    return (
        <>
            <div className="flex flex-col space-y-2">
                {links && links.length && links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-purple-100 hover:text-purple-600 md:flex-none md:justify-start md:p-2 md:px-3",
                                {
                                    'bg-purple-100 text-purple-600': pathname === link.href,
                                })}
                        >
                            <LinkIcon className="min-w-5" />
                            <p className="capitalize block">{link.name}</p>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}
