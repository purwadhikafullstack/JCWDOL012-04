import { PiHouse, PiUser, PiUserGear, PiWarehouse, PiArchive } from "react-icons/pi";

export const links = [
    { name: "Home", href: "/admin", icon: PiHouse },
    { name: "Customer", href: "/admin/customer-management", icon: PiUserGear },
    { name: "Warehouse Admin", href: "/admin/admin-management", icon: PiUser },
    { name: "Warehouse", href: "/admin/warehouse-management", icon: PiWarehouse },
    { name: "Products", href: "/admin/products", icon: PiArchive },
]