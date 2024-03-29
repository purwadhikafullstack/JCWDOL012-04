import { apiAuth } from "@/lib/axios.config";
import { TransactionsProductsModel } from "@/model/TransactionsProductsModel";
import { TransactionProductWithStockModel } from "@/model/TransactionProductWithStockModel";

export default class TransactionProductApi {
    constructor() {
    }

    async getAllTransactionProductsWithStock(transactionProducts: TransactionsProductsModel[], warehouseId:number): Promise<{ status: number, data: TransactionProductWithStockModel[] }> {
        "use server"
        const data = {
            transactionProducts: transactionProducts,
            warehouseId: warehouseId
        }
        return await apiAuth.post<TransactionProductWithStockModel[]>('/transaction/productsWithStock/', data)
            .then((res) => {
                return { status: res.status, data: res.data }
            })
            .catch((err) => {
                console.log(err)
                return { status: 500, message: "Internal Server Error", data: [] }
            });
    }

    async requestStock(data: { warehouseId: number, productId: number, transactionId: number, rawQuantity: number }): Promise<{ status: number, message: string }> {
        "use server"
        return await apiAuth.post('/transaction/admin/requestStock/', data)
            .then((res) => {
                return { status: res.status, message: res.data.message }
            })
            .catch((err) => {
                console.log(err)
                return { status: 500, message: "Internal Server Error" }
            });
    }
}