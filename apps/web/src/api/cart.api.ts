import axios from "axios";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { ProductsModel } from "@/model/ProductsModel";
import { api } from "@/lib/axios.config";
//implement axios instance -> untuk setting url dkk cukup sekali. *bisa dipisah untuk menjadi 2 setting axios instance
//api token bisa di setting di axios instance 'axios.config.ts'

export default class CartApi {
    baseUrl;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_3;
    }
    async getCart(): Promise<{ status: number, data: ShoppingCartModel[] }> {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart`);
        // return response.json();
        // return await axios.get<ShoppingCartModel[]>(`${this.baseUrl}/cart`)
        //     .then((response) => {
        //         return response.data;
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         throw error;
        //     });

        return await api.get<ShoppingCartModel[]>('/cart', {
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
                // console.log(error);
                return error.status;
            });

    }

    async preAddToCart(productId: number): Promise<{ product: ProductsModel, stock: number, status: number }> {
        "use server"
        // const response = await fetch(`${this.baseUrl}/products/${productId}`);
        // return response.json();
        // console.log(`${this.baseUrl}/cart/preAdd/${productId}`);
        return await axios.get<{ product: ProductsModel, stock: number }>(`${this.baseUrl}/cart/preAdd/${productId}`)
            .then((response) => {
                // console.log(response.data);
                return { ...response.data, status: response.status };
            })
            .catch((error) => {
                // console.log(error);
                return error.status;
            });
    }


    async addToCart(productId: number, quantity: number = 1): Promise<{ status: number }> {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ productId, quantity })
        // });
        // return response.json();
        return await axios.post(`${this.baseUrl}/cart`, {
            productId: productId,
            quantity: quantity
        })
            .then((response) => {
                return { status: response.status };
            })
            .catch((error) => {
                // console.log(error);
                return error.status;
            });

    }

    async updateCartItem(productId: number, quantity: number): Promise<{ status: number }> {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart/${productId}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ quantity })
        // });
        // return response.json();
        return await api.put(`/cart/${productId}`, {
            quantity: quantity
        })
            .then((response) => {
                return { status: response.status };
            })
            .catch((error) => {
                // console.log(error);
                return error.status;
            });
    }

    async deleteCartItem(productId: number): Promise<{ status: number }> {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart/${productId}`, {
        //     method: 'DELETE'
        // });
        // return response.json();
        return await axios.delete(`${this.baseUrl}/cart/${productId}`)
            .then((response) => {
                return { status: response.status };
            })
            .catch((error) => {
                // console.log(error);
                return error.status;
            });
    }
}