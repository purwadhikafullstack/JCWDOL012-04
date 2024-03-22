'use client'
import idr from "@/lib/idrCurrency";
import TransactionApi from "@/api/transaction.user.api";
import { useEffect, useState } from "react";
import { PaymentTypeModel } from "@/model/PaymentTypeModel";
import { ShoppingCartModel } from '@/model/ShoppingCartModel';
import {toast, ToastContainer} from 'react-toastify';

export default function ShippingSummary({ subtotal = 0, shippingCost = 0, cartData=[], closestWarehouseId }: { subtotal: number, shippingCost: number, cartData: ShoppingCartModel[], closestWarehouseId: number}) {
    const [total, setTotal] = useState(0);
    const transactionApi = new TransactionApi();

    useEffect(() => {
        setTotal(subtotal + shippingCost);
    }, [subtotal, shippingCost]);

    function handleProceedToPaymentPG() {
        // (orders: ShoppingCartModel[], paymentType: PaymentTypeModel, shippingCost:number): Promise<{status: number, data:MidtransPreTransactionResponseModel}>{
        transactionApi.preTransactionPG(cartData, shippingCost, closestWarehouseId).then((response) => {
            const redirectUrl = response.data.redirect_url;
            if(redirectUrl){
                window.location.href = redirectUrl;
            }else{
                toast.error('Redirect URL not found');
                console.log("Redirect URL not found");
            }
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    function handleProceedToPaymentTrf() {
        transactionApi.preTransactionTrf(cartData, shippingCost, closestWarehouseId).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="px-[24px] lg:w-[384px] h-fit sticky">
            <ToastContainer />
            <div className="flex flex-col gap-4 px-6 rounded-xl bg-white py-6">
                <h1 className="text-base font-bold">Shipping Summary</h1>
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{idr(subtotal)}</p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p>Shipping Cost</p>
                    <p>{idr(shippingCost)}</p>
                </div>
                <hr />
                <div className="flex justify-between">
                    <p>Total</p>
                    <p>{idr(total)}</p>
                </div>
                    <button className="bg-[var(--primaryColor)] text-white rounded-xl py-2" onClick={handleProceedToPaymentPG}>Payment Gateway Checkout</button>
                    <button className="bg-[var(--primaryColor)] text-white rounded-xl py-2 mt-[-10px]" onClick={handleProceedToPaymentTrf}>Transfer Checkout</button>
            </div>
        </div>
    )
}