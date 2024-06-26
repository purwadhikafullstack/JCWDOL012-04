'use client';

import { useState } from 'react';
import { formatToRupiah } from '@/utils/helper';

interface CartContainerProps {
  data: {
    id: number;
    name: string;
    description: string;
    price: number;
    totalStock: number;
    productCategory: {
      name: string;
    };
  };
  price: number;
  totalStock: number;
}

export const CartContainer: React.FC<CartContainerProps> = (props) => {
  const [cartQty, setCartQty] = useState<number>(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setCartQty(Number(e.target.value));
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    if (inputValue < 1 || (props.data && inputValue > props.totalStock)) {
      setCartQty(1);
    }
  };

  let subtotal;
  if (props?.price !== undefined) {
    subtotal = props?.price * cartQty;
  }

  return (
    <div
      id="add-to-cart"
      className="flex flex-col bg-white border-t lg:border rounded-t-3xl lg:rounded-xl px-[20px] pt-[10px] w-full lg:w-[280px] h-[100px] lg:h-[200px] lg:mt-[15px] lg:shadow fixed lg:static bottom-0"
    >
      <div className="hidden lg:flex my-[10px] font-semibold">Cart</div>
      <div
        id="cart-qty"
        className="flex items-center w-full md:w-[240px] space-x-3 lg:space-x-2"
      >
        <button
          onClick={() => {
            setCartQty(cartQty - 1);
          }}
          className={`text-white hover:scale-110 duration-200 bg-[var(--primaryColor)] px-[15px] py-[6px] rounded-full text-xl ${
            cartQty < 2 ? 'pointer-events-none opacity-70' : ''
          }`}
        >
          -
        </button>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*(.[0-9]+)?"
          accept="num"
          className="flex-1 w-[40px] max-w-[520px] lg:flex-none rounded-full h-[40px] text-center border border-[var(--primaryColor)]"
          value={cartQty}
          onChange={handleInputChange}
          onBlur={handleOnBlur}
        />
        <button
          onClick={() => {
            setCartQty(Number(cartQty) + 1);
          }}
          className={`text-white hover:scale-110 duration-200 bg-[var(--primaryColor)] px-[13px] py-[5px] rounded-full text-xl ${
            cartQty >= props.totalStock ? 'pointer-events-none opacity-70' : ''
          }`}
        >
          +
        </button>
        <div>
          Stock : <span className="font-semibold">{props.totalStock}</span>
        </div>
      </div>
      <div className="hidden mt-[10px] mb-[5px] lg:flex justify-between">
        <div>Subtotal :</div>
        <div className="font-semibold">
          {cartQty <= props.totalStock ? (
            formatToRupiah(subtotal as number)
          ) : (
            <span className="text-red-600">Quantity overload</span>
          )}
        </div>
      </div>
      <button
        className={`bg-[var(--primaryColor)] hover:bg-white hover:text-[var(--primaryColor)] border hover:border-[var(--primaryColor)] duration-200 mt-[10px] text-white py-[5px] rounded-full ${
          cartQty < 1 || cartQty > props.totalStock || props.totalStock == 0
            ? 'pointer-events-none opacity-70'
            : ''
        }`}
      >
        Add to Cart
      </button>
    </div>
  );
};
