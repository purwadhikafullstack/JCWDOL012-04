'use client'
import { useRouter } from "next/navigation";
import {useEffect} from "react";

export default function FailedTransaction() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push(`../../../orders/`);
        }, 2000);
    }, []);

    return (
        <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
            <h1>Payment Failed</h1>
        </div>
    )

}