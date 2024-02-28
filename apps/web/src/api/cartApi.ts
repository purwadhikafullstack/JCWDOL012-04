import axios from "axios";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";

export default class CartApi{
    baseUrl;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        console.log("API URL: ", this.baseUrl);
    }

    async getCart(): Promise<ShoppingCartModel[]>{
        // Remove this commented out code.
        // const response = await fetch(`${this.baseUrl}/cart`);
        // return response.json();
        return await axios.get<ShoppingCartModel[]>(`${this.baseUrl}/cart`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });

    }

    async addToCart(productId: number, quantity: number = 1) {
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