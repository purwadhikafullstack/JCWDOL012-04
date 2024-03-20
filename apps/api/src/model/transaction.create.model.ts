import { paymentType, orderStatus } from "@prisma/client";
export type TransactionsCreateModel = {
    transactionUid: string;
    userId: number;
    paymentType: paymentType;
    orderStatus: orderStatus;
    warehouseId: number;
    paymentProofDate?: Date;
    verifiedDate?: Date;
    shippingDate?: Date;
    sentDate?: Date;
    processDate?: Date;
    confirmationDate?: Date;
    cancelledDate?: Date;
    failedPaymentDate?: Date;
    shippingCost: number;
    total: number;
}