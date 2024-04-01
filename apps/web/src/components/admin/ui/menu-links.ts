import { IconType } from 'react-icons';
import {
  PiHouse,
  PiUser,
  PiUserGear,
  PiWarehouse,
  PiArchive,
  PiCirclesFour,
  PiTruck,
  PiNotepad,
} from 'react-icons/pi';

export type MenuLinks = {
  name: string;
  href: string;
  icon: IconType;
}[];

export const superAdminLinks = [
  { name: 'Home', href: '/admin', icon: PiHouse },
  { name: 'Orders', href: '/admin/orders', icon: PiNotepad },
  { name: 'Customer', href: '/admin/customer-management', icon: PiUser },
  {
    name: 'Warehouse Admin',
    href: '/admin/admin-management',
    icon: PiUserGear,
  },
  { name: 'Warehouse', href: '/admin/warehouse-management', icon: PiWarehouse },
  { name: 'Products', href: '/admin/product-management', icon: PiArchive },
  {
    name: 'Product Categories',
    href: '/admin/product-category-management',
    icon: PiCirclesFour,
  },
  {
    name: 'Mutations',
    href: '/admin/mutation',
    icon: PiTruck,
  },
];

export const warehouseAdminLinks = [
  { name: 'Home', href: '/admin', icon: PiHouse },
  { name: 'Orders', href: '/admin/orders', icon: PiNotepad },
  { name: 'Products', href: '/admin/product-management', icon: PiArchive },
  {
    name: 'Product Categories',
    href: '/admin/product-category-management',
    icon: PiCirclesFour,
  },
  {
    name: 'Mutations',
    href: '/admin/mutation',
    icon: PiTruck,
  },
];
