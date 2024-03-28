"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuLinks, superAdminLinks, warehouseAdminLinks } from "@/components/admin/ui/menu-links";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BottomMenu() {
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

    if (auth?.isLoading) return (
        <div className="flex space-x-3 w-full">
            {Array(6).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
            ))}
        </div>
    )

    return (
        <>
            <div className="flex items-center space-x-2 w-full">
                {links && links.length && links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx("flex h-fit min-w-fit w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-purple-100 hover:text-purple-600",
                                {
                                    'bg-purple-100 text-purple-600': pathname === link.href,
                                })}
                        >
                            <LinkIcon />
                            <p className="capitalize block ">{link.name}</p>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}