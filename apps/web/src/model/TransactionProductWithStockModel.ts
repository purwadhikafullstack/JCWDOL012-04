import { TransactionsProductsModel } from "./TransactionsProductsModel";

export interface TransactionProductWithStockModel extends TransactionsProductsModel{
    stock: number
    globalStock: number
}