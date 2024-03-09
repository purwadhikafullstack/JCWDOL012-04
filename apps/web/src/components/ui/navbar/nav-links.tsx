"use client"
import { useAuth } from "@/lib/store/auth/auth.provider";
import clsx from "clsx";
import Link from "next/link"
import { useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa";
import { PiUserCircle } from "react-icons/pi";

export default function NavLinks({ links }: { links: NavLinks }) {
    const [nav, setNav] = useState(false);
    const auth = useAuth()

    return (
        <>
            <ul className={clsx("hidden",
                { "md:flex": !auth?.user?.isAuthenticated },
            )}>
                {links.map(({ id, label, href }) => (
                    <li
                        key={id}
                        className=" px-4 cursor-pointer capitalize font-medium text-gray-800 hover:scale-105 hover:text-purple-600 duration-200 link-underline"
                    >
                        <Link href={href}>{label}</Link>
                    </li>
                ))}
            </ul>

            <div
                onClick={() => setNav(!nav)}
                className={clsx("cursor-pointer pr-1 z-10 text-gray-700",
                    { "md:hidden": !auth?.user?.isAuthenticated },
                )}
            >
                {!auth?.user?.isAuthenticated && (nav ? <FaTimes size={30} /> : <FaBars size={30} />)}
                {auth?.user?.isAuthenticated && (nav ? <FaTimes size={30} /> : <PiUserCircle size={30} />)}
            </div>

            {nav && (
                <div className={clsx("flex justify-end  absolute top-16 right-4 xl:right-auto z-30 ",
                    { "md:hidden": !auth?.user?.isAuthenticated },
                )}>
                    <ul className="flex w-fit flex-col capitalize font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50  rtl:space-x-reverse   md:bg-white dark:bg-gray-800 dark:border-gray-700">
                        {links.map(({ id, label, href }) => (
                            <li
                                key={id}
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                            >
                                <Link onClick={() => setNav(!nav)} href={href}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </>
    )
}