import axios from "axios";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import { UsersModel } from "@/model/UsersModel";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { TransactionsModel } from "@/model/TransactionsModel";
import { MutationsModel } from "@/model/MutationsModel";
import { MutationTypeModel } from "@/model/MutationTypeModel";
import { ProductsModel } from "@/model/ProductsModel";
import { MidtransPreTransactionResponseModel } from "@/model/api/responses/midtrans.pretransaction.response.model";
import { api } from "@/lib/axios.config";
import { PaymentTypeModel } from "@/model/PaymentTypeModel";

export default class TransactionApi{
    baseUrl;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_3;
    }

    async getUserCities(): Promise<{status: number, data:UsersModel}>{ 
        "use server"
        return await api.get<UsersModel>('/transaction/address', {
            params: {
                _: new Date().getTime(),
            }
        })
        .then((response) => {
            const status = response.status;
            const data = response.data;
            return {status, data};
        })
        .catch((error) => {
            console.log(error);
            return error.status;
        });
    }
    
    async preTransactionPG(orders: ShoppingCartModel[], shippingCost:number, closestWarehouseId:number): Promise<{status: number, data:MidtransPreTransactionResponseModel}>{
        "use server"
        const data = {
            orders: orders,
            paymentType: "PAYMENT_GATEWAY",
            shippingCost: shippingCost,
            closestWarehouseId: closestWarehouseId
        }
        return await api.post<MidtransPreTransactionResponseModel>('/transaction/pretransaction', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            console.log(JSON.stringify(response.data));
            return {status, data};
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async preTransactionTrf(orders: ShoppingCartModel[], shippingCost:number, closestWarehouseId:number): Promise<{status: number, data:MidtransPreTransactionResponseModel}>{
        "use server"
        const data = {
            orders: orders,
            paymentType: "TRANSFER",
            shippingCost: shippingCost,
            closestWarehouseId: closestWarehouseId
        }
        return await api.post<MidtransPreTransactionResponseModel>('/transaction/pretransaction', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            console.log(JSON.stringify(response.data));
            return {status, data};
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }
}