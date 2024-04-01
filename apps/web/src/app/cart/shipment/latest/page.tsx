'use client'
import TransactionApi from "@/api/transaction.user.api.withAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function LatestTransaction() {
    const auth = useAuth();
    const transactionApi = new TransactionApi();
    const router = useRouter();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;
    const [transactionUid, setTransactionUid] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        transactionApi.getLatestTransactionUid().then((response) => {
            if (response.status) {
                if (response.status === 200) {
                    setTransactionUid(response.data.replace(/"/g, ''));
                    router.push(`../../../orders/${transactionUid}`)
                }
            } else {
                console.log('error');
            }
        }).catch((error) => {
            console.log(error);
        });
        setLoading(false);
    }, [isAuthenticated, role]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                <h1>Loading...</h1>
            </div>
        )
    }

    if (!isAuthenticated || role !== 'CUSTOMER') {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Unauthorized | 401
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
            <h1>Redirecting...</h1>
        </div>
    )

}