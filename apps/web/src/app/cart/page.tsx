'use client'
import CartTable from "@/components/cart/cart.table";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { useUpdateCart } from "@/lib/cart.provider.update";
import { useEffect, useState } from "react";

export default function Cart() {
    const auth = useAuth();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;
    const updateCart = useUpdateCart();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        updateCart();
        setLoading(false);
    },[loading]);

    if(loading){
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                <h1>Loading...</h1>
            </div>
        )
    }

    if (!loading && (!isAuthenticated || role !== 'CUSTOMER')) {
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
        </div>
    )
}