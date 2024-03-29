import { TransactionsModel } from "@/model/TransactionsModel";
import { date_format } from "@/lib/date.format";

export default function Timeline({transaction}:{transaction:TransactionsModel}){
            const paymentProofDate = transaction.paymentProofDate ? date_format(new Date(transaction.paymentProofDate)) : '-';
            const failedPaymentDate = transaction.failedPaymentDate ? date_format(new Date(transaction.failedPaymentDate)) : '-';
            const verifiedDate = transaction.verifiedDate ? date_format(new Date(transaction.verifiedDate)) : '-';
            const processDate = transaction.processDate ? date_format(new Date(transaction.processDate)) : '-';
            const cancelledDate = transaction.cancelledDate ? date_format(new Date(transaction.cancelledDate)) : '-';
            const shippingDate = transaction.shippingDate ? date_format(new Date(transaction.shippingDate)) : '-';    
            const sentDate = transaction.sentDate ? date_format(new Date(transaction.sentDate)) : '-';
            const confirmationDate = transaction.confirmationDate ? date_format(new Date(transaction.confirmationDate)) : '-';

            return(
                <div className="">
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Payment Proof Date</p>
                        <p>{paymentProofDate}</p>
                    </div>
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Failed Payment Date</p>
                        <p>{failedPaymentDate}</p>
                    </div>
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Verified Date</p>
                        <p>{verifiedDate}</p>
                    </div>
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Process Date</p>
                        <p>{processDate}</p>
                    </div>
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Cancelled Date</p>
                        <p>{cancelledDate}</p>
                    </div>
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Shipping Date</p>
                        <p>{shippingDate}</p>
                    </div>
                    {/* <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Sent Date</p>
                        <p>{sentDate}</p>
                    </div> */}
                    <div className="flex justify-between border-t border-[var(--lightPurple)]">
                        <p>Confirmation Date</p>
                        <p>{confirmationDate}</p>
                    </div>
                </div>
            )

}