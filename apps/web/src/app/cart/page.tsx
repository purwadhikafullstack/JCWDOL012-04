'use client'
import CartTable from "@/components/cart/cart.table";
import CartAdd from "@/components/cart/cart.add";
import CartIcon from "@/components/cart/cart.icon";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function Cart() {
    const auth = useAuth();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;
    // const isAuthorLoading = auth?.isLoading;

    if (!isAuthenticated || role !== 'CUSTOMER') {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Unauthorized | 401
            </div>
        )
    }

    return (
        <div className="ml-20 mt-10">
            <h1 className="text-5xl text-[var(--primaryColor)] font-bold">Cart</h1>
            <CartTable />
            <CartAdd productId={1} />
            <CartIcon />
        </div>
    )
}