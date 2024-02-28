"use server"
import CartTable from "@/components/cart/cartTable";
import { ShoppingCartModel } from "@/model/ShoppingCartModel";
import CartApi from "@/api/cartApi";

export async function getData(): Promise<ShoppingCartModel[]> {
    const cartApi = new CartApi();
    const cartData: ShoppingCartModel[] = await cartApi.getCart();
    return cartData;
}

export async function editCart(id: number, quantity: number): Promise<boolean> {
    "use server"
    const cartApi = new CartApi();
    const result = await cartApi.updateCartItem(id, quantity);
    if (result.status === 200) {
        return true;
    }else{
        return false;
    }
}

export async function deleteCartItem(id: number): Promise<boolean> {
    "use server"
    const cartApi = new CartApi();
    const result = await cartApi.deleteCartItem(id);
    if (result.status === 200) {
        return true;
    }else{
        return false;
    }
}

export default async function Cart() {
    const cart = await getData();

    if (!cart) {
        return <h1>Loading...</h1>
    }
    return (
        <main>
            <h1>Cart</h1>
            <h2>Cart Data:</h2>
            {/* <CartTable cartData={cart} /> */}
            <CartTable cartData={cart} editCart={(id,quantity)=>editCart(id,quantity)} deleteCartItem={(id)=>deleteCartItem(id)}/>
        </main>
    )
}