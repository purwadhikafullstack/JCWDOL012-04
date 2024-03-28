import axios from "axios";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import { UsersModel } from "@/model/UsersModel";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { TransactionsModel } from "@/model/TransactionsModel";
import { MutationsModel } from "@/model/MutationsModel";
import { MutationTypeModel } from "@/model/MutationTypeModel";
import { ProductsModel } from "@/model/ProductsModel";
import { MidtransPreTransactionResponseModel } from "@/model/api/responses/midtrans.pretransaction.response.model";
import { apiAuth } from "@/lib/axios.config";
import { PaymentTypeModel } from "@/model/PaymentTypeModel";
import { OrderStatusModel } from "@/model/OrderStatusModel";
import { ProductCategoriesModel } from "@/model/ProductCategoriesModel";

export default class TransactionApi {
    baseUrl;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_3;
    }

    async getAll(): Promise<{ status: number, data: TransactionsModel[] }> {
        "use server"
        return await apiAuth.get<TransactionsModel[]>('/transaction/', {
            params: {
                _: new Date().getTime(),
            }
        })
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

    async getAllOrderStatus(): Promise<{ status: number, data: OrderStatusModel[] }> {
        "use server"
        return await apiAuth.get<OrderStatusModel[]>('/transaction/orderstatus', {
            params: {
                _: new Date().getTime(),
            }
        })
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

    async getAllForAdmin(): Promise<{ status: number, data: TransactionsModel[] }> {
        "use server"
        return await apiAuth.get<TransactionsModel[]>('/transaction/admin/', {
            params: {
                _: new Date().getTime(),
            }
        })
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

    async getAllProductCategory(): Promise<{ status: number, data: ProductCategoriesModel[] }> {
        "use server"
        return await apiAuth.get<ProductCategoriesModel[]>('/transaction/productcategory', {
            params: {
                _: new Date().getTime(),
            }
        })
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

    async getTransaction(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        return await apiAuth.get<TransactionsModel>('/transaction/orders/' + transactionUid)
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

    async getTransactionAdmin(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        return await apiAuth.get<TransactionsModel>('/transaction/admin/orders/' + transactionUid)
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

    async getUserCities(): Promise<{ status: number, data: UsersModel }> {
        "use server"
        return await apiAuth.get<UsersModel>('/transaction/address', {
            params: {
                _: new Date().getTime(),
            }
        })
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

    async preTransactionPG(orders: ShoppingCartModel[], shippingCost: number, closestWarehouseId: number, shippingAddressId: number): Promise<{ status: number, data: MidtransPreTransactionResponseModel }> {
        "use server"
        const data = {
            orders: orders,
            paymentType: "PAYMENT_GATEWAY",
            shippingCost: shippingCost,
            closestWarehouseId: closestWarehouseId,
            shippingAddressId: shippingAddressId
        }
        return await apiAuth.post<MidtransPreTransactionResponseModel>('/transaction/pretransaction', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            console.log(JSON.stringify(response.data));
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async preTransactionTrf(orders: ShoppingCartModel[], shippingCost: number, closestWarehouseId: number, shippingAddressId: number): Promise<{ status: number, data: MidtransPreTransactionResponseModel }> {
        "use server"
        const data = {
            orders: orders,
            paymentType: "TRANSFER",
            shippingCost: shippingCost,
            closestWarehouseId: closestWarehouseId,
            shippingAddressId: shippingAddressId
        }
        return await apiAuth.post<MidtransPreTransactionResponseModel>('/transaction/pretransaction', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            console.log(JSON.stringify(response.data));
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async cancelOrder(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/orders/cancel/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async confirmOrder(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/orders/confirm/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async postPaymentProof(transactionUid: string, paymentProof: File): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = new FormData();
        data.append('transactionUid', transactionUid);
        data.append('file', paymentProof);

        console.log(data);
        return await apiAuth.post<TransactionsModel>('/transaction/orders/paymentproof/', data, {
            params: {
                _: new Date().getTime(),
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async getLatestTransactionUid(): Promise<{ status: number, data: string }> {
        "use server"
        return await apiAuth.get<string>('/transaction/orders/latest/')
            .then((response) => {
                const status = response.status;
                const data = response.data;
                return { status, data };
            }).catch((error) => {
                console.log(error);
                return error.status;
            });
    }

    async verifyPayment(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/admin/orders/verify/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async denyPayment(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/admin/orders/deny/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async processOrder(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/admin/orders/process/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }

    async shipOrder(transactionUid: string): Promise<{ status: number, data: TransactionsModel }> {
        "use server"
        const data = {
            transactionUid: transactionUid
        }
        return await apiAuth.post<TransactionsModel>('/transaction/admin/orders/ship/', data, {
            params: {
                _: new Date().getTime(),
            }
        }).then((response) => {
            const status = response.status;
            const data = response.data;
            return { status, data };
        }).catch((error) => {
            console.log(error);
            return error.status;
        });
    }
}