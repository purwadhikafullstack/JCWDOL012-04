import axios from "axios";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import { api } from "@/lib/axios.config";
//implement axios instance -> untuk setting url dkk cukup sekali. *bisa dipisah untuk menjadi 2 setting axios instance
//api token bisa di setting di axios instance 'axios.config.ts'

export default class CartApi{
    baseUrl;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        console.log("API URL: ", this.baseUrl);
    }
    async getCart(): Promise<{status: number, data:ShoppingCartModel[]}>{
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

        return await api.get<ShoppingCartModel[]>('/cart')
        .then((response) => {
            const status = response.status;
            const data = response.data;
            return {status, data};
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    }

    async addToCart(productId: number, quantity: number = 1) {
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
                return response.data.json();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    async updateCartItem(productId: number, quantity: number) {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart/${productId}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ quantity })
        // });
        // return response.json();
        return await axios.put(`${this.baseUrl}/cart/${productId}`, {
            quantity: quantity
        })
            .then((response) => {
                return response.data.json();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async deleteCartItem(productId: number) {
        "use server"
        // const response = await fetch(`${this.baseUrl}/cart/${productId}`, {
        //     method: 'DELETE'
        // });
        // return response.json();
        return await axios.delete(`${this.baseUrl}/cart/${productId}`)
            .then((response) => {
                return response.data.json();
            })
            .catch((error) => {
                console.log(error);
            });
    }
}