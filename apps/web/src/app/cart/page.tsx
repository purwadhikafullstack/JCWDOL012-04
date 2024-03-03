import CartTable from "@/components/cart/cart.table";
import CartAdd from "@/components/cart/cart.add";
import CartIcon from "@/components/cart/cart.icon";

export default async function Cart() {
    return (
        <div className="ml-20 mt-10">
            <h1 className="text-5xl text-[var(--primaryColor)] font-bold">Cart</h1>
            <CartTable/>
            <CartAdd productId={1}/>
            <CartIcon/>
        </div>
    )
}