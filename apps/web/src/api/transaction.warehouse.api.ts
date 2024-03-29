import { apiAuth } from "@/lib/axios.config";
import { WarehousesModel } from "@/model/WarehousesModel";

export default class TransactionWarehouseApi {
    constructor() {
    }

    async getAllWarehouses() {
        "use server"
        return await apiAuth.get<WarehousesModel[]>(`/transaction/admin/warehouses/`)
        .then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        })
        .catch((error) => {
            console.log(error);
            return error.status;
        });
    }
}