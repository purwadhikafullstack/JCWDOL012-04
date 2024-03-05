import { PaymentTypeModel } from "./PaymentTypeModel";
import { OrderStatusModel } from "./OrderStatusModel";
import { WarehousesModel } from "./WarehousesModel";
import { UsersModel } from "./UsersModel";
import { TransactionsProductsModel } from "./TransactionsProductsModel";
import { MutationsModel } from "./MutationsModel";

export interface TransactionsModel {
    id: number;
    userId: number;
    user?: UsersModel;
    paymentType: PaymentTypeModel;
    paymentProof?: string;
    orderStatus: OrderStatusModel;
    warehouseId: number;
    warehouse?: WarehousesModel;
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
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    products?: TransactionsProductsModel[];
    mutations?: MutationsModel[];
}