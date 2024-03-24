import { IconType } from "react-icons";
import { PiHouse, PiUser, PiUserGear, PiWarehouse, PiArchive, PiCirclesFour } from "react-icons/pi";

export type MenuLinks = {
    name: string;
    href: string;
    icon: IconType;
}[]

export const superAdminLinks = [
    { name: "Home", href: "/admin", icon: PiHouse },
    { name: "Customer", href: "/admin/customer-management", icon: PiUser },
    { name: "Warehouse Admin", href: "/admin/admin-management", icon: PiUserGear },
    { name: "Warehouse", href: "/admin/warehouse-management", icon: PiWarehouse },
    { name: "Products", href: "/admin/products", icon: PiArchive },
    { name: "Product Categories", href: "/admin/product-categories", icon: PiCirclesFour },
]

export const warehouseAdminLinks = [
    { name: "Home", href: "/admin", icon: PiHouse },
    { name: "Products", href: "/admin/products", icon: PiArchive },
    { name: "Product Categories", href: "/admin/product-categories", icon: PiCirclesFour },
]