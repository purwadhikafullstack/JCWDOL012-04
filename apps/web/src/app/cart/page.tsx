"use server"
import CartTable from "@/components/cart/cartTable";

export default async function Cart() {
    return (
        <main>
            <h1>Cart</h1>
            <h2>Cart Data:</h2>
            <CartTable/>
        </main>
    )
}