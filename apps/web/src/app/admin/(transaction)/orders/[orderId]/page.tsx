'use client';
import { useState, useEffect } from "react";
import { TransactionsModel } from "@/model/TransactionsModel";
import TransactionApi from "@/api/transaction.user.api.withAuth";
import { useAuth } from "@/lib/store/auth/auth.provider";
import { date_format } from "@/lib/date.format";
import Timeline from "@/components/transaction/timeline";
import TransactionProductDetail from "@/components/transaction/detail.product";
import idr from "@/lib/idrCurrency";
import { useUpdateCart } from "@/lib/cart.provider.update";

export default function TransactionDetail({ params }: { params: { orderId: string } }) {
    const updateCart = useUpdateCart();
    const [transaction, setTransaction] = useState<TransactionsModel | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [status, setStatus] = useState<number>(0);
    const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPaymentProofOpen, setIsPaymentProofOpen] = useState<boolean>(false);
    const transactionApi = new TransactionApi();
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

    async function handleCancelOrder() {
        if (transaction) {
            const res = await transactionApi.cancelOrder(transaction.transactionUid);
            if (res.status == 200) {
                setUpdate(!update);
            }
        }
    }

    async function handleConfirmOrder() {
        if (transaction) {
            const res = await transactionApi.confirmOrder(transaction.transactionUid);
            if (res.status == 200) {
                setUpdate(!update);
            }
        }
    }

    function handlePaymentProofButton() {
        setIsPaymentProofOpen(!isPaymentProofOpen);
    }

    async function handleUploadPaymentProof(file: File) {
        if (transaction) {
            const res = await transactionApi.postPaymentProof(transaction.transactionUid, file);
            if (res.status == 200) {
                setUpdate(!update);
                handlePaymentProofButton();
            } else {
                alert("Failed to upload payment proof");
            }
        }
    }

    if (transaction) {
        if (!isAuthenticated || (role !== 'SUPER_ADMIN' && role!=="WAREHOUSE_ADMIN")) {
            return (
                <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                    Unauthorized | 401
                </div>
            )
        }


        return (
            <div className="px-[24px] h-fit mx-16 mt-5 overflow-auto">
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
                            <TransactionProductDetail transaction={transaction} />
                        </div>
                        <div className="mt-5">
                            <div className="border border-[var(--lightPurple)] p-2 rounded-xl">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                                <hr className="my-2" />
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
                                        <div className="border-l border-l-[var(--lightPurple)]">
                                        <button className="text-sm lg:text-md max-h-10 ml-2 mb-5 bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handlePaymentProofButton}>Edit Payment Proof</button>
                                        {isPaymentProofOpen && (
                                            <div className="border border-[var(--lightPurple)] rounded-xl p-2">
                                                <form
                                                    onSubmit={(event) => {
                                                        event.preventDefault();
                                                        const fileInput = event.currentTarget.elements.namedItem("file") as HTMLInputElement;
                                                        const file = fileInput.files?.[0];
                                                        if (file) {
                                                            if (file.size > 1024 * 1024) { // file size limit 1MB
                                                                alert("File size exceeds 1MB. Please select a smaller file.");
                                                            } else {
                                                                handleUploadPaymentProof(file);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        name="file"
                                                        type="file"
                                                        accept="image/jpeg, image/png"
                                                        className=""
                                                    />
                                                    <button className="bg-[var(--primaryColor)] rounded-xl p-2 mt-2 mx-auto block text-white hover:bg-[var(--lightPurple)]" type="submit">Upload</button>
                                                </form>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl px-5 md:max-w-72 2xl:min-w-72 md:my-0 my-5">
                        {(transaction.orderStatus == "PENDING_PROOF" && transaction.paymentType == "TRANSFER") && (<button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handlePaymentProofButton}>Upload Payment Proof</button>)}
                        {isPaymentProofOpen && (
                            <div className="border border-[var(--lightPurple)] rounded-xl p-2">
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        const fileInput = event.currentTarget.elements.namedItem("file") as HTMLInputElement;
                                        const file = fileInput.files?.[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024) { // file size limit 1MB
                                                alert("File size exceeds 1MB. Please select a smaller file.");
                                            } else {
                                                handleUploadPaymentProof(file);
                                            }
                                        }
                                    }}
                                >
                                    <input
                                        name="file"
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        className=""
                                    />
                                    <button className="bg-[var(--primaryColor)] rounded-xl p-2 mt-2 mx-auto block text-white hover:bg-[var(--lightPurple)]" type="submit">Upload</button>
                                </form>
                            </div>
                        )}
                        {(transaction.orderStatus == "SHIPPING") && (<button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleConfirmOrder}>Confirm Recieved</button>)}
                        {(transaction.orderStatus == "PENDING_PROOF" && transaction.paymentType == "TRANSFER") && (<button className="bg-[var(--primaryColor)] hover:bg-[var(--lightPurple)] rounded-xl text-white p-2" onClick={handleCancelOrder}>Cancel Order</button>)}
                    </div>
                </div>
            </div>
        )
    }
}