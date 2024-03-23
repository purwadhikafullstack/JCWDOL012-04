import axios from "axios";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { ProductsModel } from "@/model/ProductsModel";
import { api, apiAuth } from "@/lib/axios.config";
//implement axios instance -> untuk setting url dkk cukup sekali. *bisa dipisah untuk menjadi 2 setting axios instance
//api token bisa di setting di axios instance 'axios.config.ts'

export default class CartApi{
    constructor() {
    }
    async getCart(): Promise<{status: number, data:ShoppingCartModel[]}>{
        "use server"
        return await apiAuth.get<ShoppingCartModel[]>('/cart', {
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

    async preAddToCart(productId: number): Promise<{product:ProductsModel, stock:number, status:number}>{
        "use server"
        return await apiAuth.get<{product:ProductsModel, stock:number}>(`/cart/preAdd/${productId}`)
            .then((response) => {
                console.log(response.data);
                return {...response.data, status: response.status};
            })
            .catch((error) => {
                console.log(error);
                return error.status;
            });
    }


    async addToCart(productId: number, quantity: number = 1): Promise<{status: number}>{
        "use server"
        return await apiAuth.post(`/cart`, {
            productId: productId,
            quantity: quantity
        })
            .then((response) => {
                return {status: response.status};
            })
            .catch((error) => {
                console.log(error);
                return error.status;
            });

    }

    async updateCartItem(productId: number, quantity: number): Promise<{status: number}>{
        "use server"
        return await apiAuth.put(`/cart/${productId}`, {
            quantity: quantity
        })
            .then((response) => {
                return {status: response.status};
            })
            .catch((error) => {
                console.log(error);
                return error.status;
            });
    }

    async deleteCartItem(productId: number): Promise<{status: number}> {
        "use server"
        return await apiAuth.delete(`/cart/${productId}`)
            .then((response) => {
                return {status: response.status};
            })
            .catch((error) => {
                console.log(error);
                return error.status;
            });
    }
}