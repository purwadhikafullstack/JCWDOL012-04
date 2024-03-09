import { PiAddressBook } from "react-icons/pi"

export const guestLinks: NavLinks = [
    {
        id: 1,
        label: 'Login',
        href: "/auth/login",
    },
    {
        id: 2,
        label: "Register",
        href: "/auth/register",
    },
]

export const customerLinks: NavLinks = [
    {
        id: 1,
        label: "Profile",
        href: "/profile",
    },
    {
        id: 2,
        label: "Logout",
        href: "/auth/logout",
    }
]