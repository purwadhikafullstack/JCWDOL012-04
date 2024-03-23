"use client"

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "@/components/admin/ui/menu-links";

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
                            className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-purple-100 hover:text-purple-600 md:flex-none md:justify-start md:p-2 md:px-3",
                                {
                                    'bg-purple-100 text-purple-600': pathname === link.href,
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
