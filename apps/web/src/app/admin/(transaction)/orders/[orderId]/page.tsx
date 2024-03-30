'use client';
import { useState, useEffect } from "react";
import { TransactionsModel } from "@/model/TransactionsModel";
import TransactionApi from "@/api/transaction.user.api.withAuth";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { date_format } from "@/lib/date.format";
import Timeline from "@/components/transaction/timeline";
import TransactionProductDetail from "@/components/transaction/detail.product.admin";
import idr from "@/lib/idrCurrency";
import { useUpdateCart } from "@/lib/cart.provider.update";
import { TransactionProductWithStockModel } from "@/model/TransactionProductWithStockModel";
import { TransactionsProductsModel } from "@/model/TransactionsProductsModel";
import TransactionProductApi from "@/api/transaction.product.api";

export default function TransactionDetail({ params }: { params: { orderId: string } }) {
    const updateCart = useUpdateCart();
    const [transaction, setTransaction] = useState<TransactionsModel | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [status, setStatus] = useState<number>(0);
    const [transactionProductsWithStock, setTransactionProductsWithStock] = useState<TransactionProductWithStockModel[]>([]);
    const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isStockEnough, setIsStockEnough] = useState<boolean>(true);
    const transactionApi = new TransactionApi();
    const transactionProductApi = new TransactionProductApi();
    const auth = useAuth();
    const isAuthenticated = auth?.user?.isAuthenticated;
    const role = auth?.user?.data?.role;
    const userId = auth?.user?.data?.id;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_BACKEND_URL_DEV;

    useEffect(() => {
        updateCart();
        const timeoutId = setTimeout(() => {
            transactionApi.getTransactionAdmin(params.orderId)
                .then((res) => {
                    setTransaction(res.data);
                    setStatus(res.status);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setStatus(err.status);
                    setLoading(false);
                });
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [update, params.orderId]);


    useEffect(() => {
        if (transaction && transaction.products) {
            const transactionsProductList: TransactionsProductsModel[] = transaction.products;
            if (transactionsProductList && transactionsProductList.length > 0) {
                transactionProductApi.getAllTransactionProductsWithStock(transactionsProductList, transaction.warehouseId)
                    .then((res) => {
                        if (res.status === 200) {
                            setTransactionProductsWithStock(res.data);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }, [transaction]);

    useEffect(() => {
        if (transaction) {
            if (transactionProductsWithStock) {
                let flag = true;
                transactionProductsWithStock.forEach((item) => {
                    if (item.stock < item.quantity) {
                        flag = false;
                    }
                });
                setIsStockEnough(flag);
            }
        }
    }, [transaction, transactionProductsWithStock, update, isStockEnough]);


    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Loading...
            </div>
        )
    }

    if (!transaction && !loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Transaction not found | 404
            </div>
        )
    }

    async function handleUpdate() {
        setUpdate(!update);
    }

    async function handleCancelOrder() {
        if (transaction) {
            const res = await transactionApi.cancelOrder(transaction.transactionUid);
            if (res.status == 200) {
                handleUpdate();
            }
        }
    }

    async function handleVerifyPayment() {
        if (transaction) {
            const res = await transactionApi.verifyPayment(transaction.transactionUid);
            if (res.status == 200) {
                handleUpdate();
            }
        }
    }

    async function handleDenyPayment() {
        if (transaction) {
            const res = await transactionApi.denyPayment(transaction.transactionUid);
            if (res.status == 200) {
                handleUpdate();
            }
        }
    }

    async function handleProcessOrder() {
        if (transaction) {
            const res = await transactionApi.processOrder(transaction.transactionUid)
            if (res.status == 200) {
                handleUpdate();
            }
        }
    }

    async function handleShippingOrder() {
        if (transaction) {
            const res = await transactionApi.shipOrder(transaction.transactionUid)
            if (res.status == 200) {
                handleUpdate();
            }
        }
    }

    if (transaction) {
        if (!isAuthenticated || (role !== 'SUPER_ADMIN' && role !== "WAREHOUSE_ADMIN")) {
            return (
                <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                    Unauthorized | 401
                </div>
            )
        }

        return (
            <div className="h-fit pb-[120px] mt-5 mx-2 sm:mx-0 overflow-auto">
                <div>
                    <div className="flex">
                        <h1 className="text-2xl font-semibold pr-2">Transaction Detail</h1>
                        {transaction.orderStatus == "CONFIRMED" && (<p className="text-2xl text-gray-400">- order finished</p>)}
                    </div>
                    <hr className="my-2" />
                </div>
                <div className="md:flex gap-5 my-5">
                    <div className=" h-fit max-w-[888px] 2xl:min-w-[888px]">
                        <div className="border border-[var(--lightPurple)] p-2 rounded-xl">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold">{transaction.orderStatus}</h2>
                                <button className="text-[var(--primaryColor)] hover:underline" onClick={() => { setIsTimelineOpen(!isTimelineOpen) }}>Timeline Detail</button>
                            </div>
                            <hr className="my-2" />
                            <div className={`bg-gray-200 p-2 rounded-xl ${isTimelineOpen ? 'block' : 'hidden'}`}>
                                <h2 className="text-md font-semibold">Timeline</h2>
                                <Timeline transaction={transaction} />
                            </div>
                            <hr className={`my-2 ${isTimelineOpen ? 'block' : 'hidden'}`} />
                            <div className="flex justify-between">
                                <p>No. Invoice</p>
                                <p>{transaction.transactionUid}</p>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between">
                                <p>Transaction Date</p>
                                <p>{date_format(new Date(transaction.createdAt))}</p>
                            </div>
                        </div>
                        <div className="mt-5">
                            {transaction && <TransactionProductDetail handleUpdate={handleUpdate} transaction={transaction} transactionProductWithStock={transactionProductsWithStock} />}
                        </div>
                        <div className="mt-5">
                            <div className="border border-[var(--lightPurple)] p-2 rounded-xl">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                                <hr className="my-2" />
                                <p className="font-semibold">from</p>
                                <p>{transaction.warehouse?.name ?? "placeholder_warehouse_name"}</p>
                                <p className="font-semibold">to</p>
                                <p>{transaction.shippingAddress?.address}</p>
                            </div>
                        </div>
                        <div className="mt-5">
                            <div className="border border-[var(--lightPurple)] p-2 rounded-xl">
                                <h2 className="text-xl font-semibold">Payment Detail</h2>
                                <hr className="my-2" />
                                <div className="flex justify-between">
                                    <p>Payment Method</p>
                                    <p>{transaction.paymentType}</p>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between">
                                    <p>Payment Status</p>
                                    <p>{transaction.orderStatus}</p>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between">
                                    <p>Shipping Cost</p>
                                    <p>{idr(transaction.shippingCost)}</p>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between">
                                    <p>Total Payment</p>
                                    <p>{idr(transaction.total)}</p>
                                </div>
                            </div>
                        </div>
                        {transaction.paymentProof && (
                            <div className="mt-5 border p-2 border-[var(--lightPurple)] rounded-xl">
                                <div className="">
                                    <h2 className="text-xl font-semibold mb-2">payment proof:</h2>
                                    <div className="flex gap-2">
                                        <img src={baseUrl + "" + transaction.paymentProof} alt="payment proof" className="w-1/2 max-w-[500px] max-h-[500px]" />
                                        {(transaction.orderStatus == "PENDING_VERIFICATION" && transaction.paymentType == "TRANSFER") && (
                                            <div className="flex flex-col gap-2">
                                                <button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleVerifyPayment}>Verify Payment</button>
                                                <button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleDenyPayment}>Deny Payment</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl px-5 md:max-w-72 2xl:min-w-72 md:my-0 my-5">

                        {(transaction.orderStatus == "VERIFIED") && (<button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleProcessOrder}>Process Order</button>)}
                        {(transaction.orderStatus == "PROCESSING") && (<button className={isStockEnough ? "bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] text-white rounded-xl p-2" : "bg-gray-400 rounded-xl p-2"} onClick={handleShippingOrder} disabled={!isStockEnough} >Ship Order</button>)}
                        {(transaction.orderStatus != "CANCELLED" && transaction.orderStatus != "SHIPPING" && transaction.orderStatus != "CONFIRMED" && transaction.orderStatus != "FAILED_PAYMENT") && (<button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleCancelOrder}>Cancel Order</button>)}

                    </div>
                </div>
            </div>
        )
    }
}