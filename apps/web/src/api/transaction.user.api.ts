import axios from "axios";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import { UsersModel } from "@/model/UsersModel";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { TransactionsModel } from "@/model/TransactionsModel";
import { MutationsModel } from "@/model/MutationsModel";
import { MutationTypeModel } from "@/model/MutationTypeModel";
import { ProductsModel } from "@/model/ProductsModel";
import { api } from "@/lib/axios.config";

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
`   1`
}