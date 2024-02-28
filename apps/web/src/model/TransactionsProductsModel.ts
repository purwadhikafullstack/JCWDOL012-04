import { TransactionsModel } from "./TransactionsModel";
import { ProductsModel } from "./ProductsModel";

export interface TransactionsProductsModel {
    id: number;
    transactionId: number;
    transaction?: TransactionsModel;
    productId: number;
    product?: ProductsModel;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}