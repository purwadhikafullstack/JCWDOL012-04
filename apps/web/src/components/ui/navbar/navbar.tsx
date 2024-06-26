"use client"
import { useAuth } from "@/lib/store/auth/auth.provider";
import NavLinks from "./nav-links";
import { guestLinks, customerLinks, warehouseAdminLinks, superAdminLinks } from "./links";
import { useState, useEffect } from "react";
import CartIcon from "@/components/cart/cart.icon";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const auth = useAuth()
  const isAuthPage = usePathname().includes('/auth')
  let [links, setLinks] = useState<NavLinks | null | undefined>(undefined)

  useEffect(() => {
    if (!auth?.isLoading && !auth?.user?.isAuthenticated) {
      setLinks(guestLinks)
    } else if (!auth?.isLoading && auth?.user?.isAuthenticated && auth?.user?.data?.role === 'CUSTOMER') {
      setLinks(customerLinks)
    } else if (!auth?.isLoading && auth?.user?.isAuthenticated && auth?.user?.data?.role === 'WAREHOUSE_ADMIN') {
      setLinks(warehouseAdminLinks)
    } else if (!auth?.isLoading && auth?.user?.isAuthenticated && auth?.user?.data?.role === 'SUPER_ADMIN') {
      setLinks(superAdminLinks)
    } else {
      setLinks(null)
    }
  }, [auth?.user])

  return (
    <nav className="bg-white md:sticky w-full md:z-20 md:top-0 md:start-0 border-b border-purple-200">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <img src="/images/palugada-icon.png" className="h-8 " alt="Palugada Logo" />
        </a>
        {!isAuthPage &&
          <div className="flex gap-3 items-center">
            {auth?.user?.isAuthenticated && auth?.user?.data?.role === 'CUSTOMER'
              ? <CartIcon />
              : null}

            {links
              ? <NavLinks links={links} />
              : null}

          </div>}
      </div>
    </nav>
  )
}

