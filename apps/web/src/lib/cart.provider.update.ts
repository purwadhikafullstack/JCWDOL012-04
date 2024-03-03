import React from "react";
import { CartContext, cartContextType} from "@/lib/cart.provider";
import CartApi from "@/api/cart.api";

export function useUpdateCart(){
    const cartApi = new CartApi();
    const { setCart } = React.useContext<cartContextType>(CartContext);

    const updateCart = async () => {
        try {
          const response = await cartApi.getCart();
          setCart(response.data);
        } catch (error) {
          console.log(error);
        }
      };
    
      return updateCart;
}