'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { CartContainer } from '@/components/CartContainer';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  totalStock: number;
  productCategory: {
    name: string;
  };
}

interface ProductDetailsProps {
  params: {
    productId: string;
  };
}

const API = process.env.NEXT_PUBLIC_BASE_API_URL;

export default function ProductDetails({ params }: ProductDetailsProps) {
  const [data, setData] = useState<Product | null>(null);
  const [cartQty, setCartQty] = useState<any>(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get<Product>(
          `${API}/product/${params.productId}`,
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, [params.productId]);

  function formatToRupiah(number: number) {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    return formatter.format(number);
  }

  return (
    <>
      {data ? (
        <div className="flex flex-col lg:flex-row lg:justify-center w-full lg:px-[20px] h-auto mt-[30px]">
          <div
            id="product-image"
            className="relative w-full lg:w-[350px] xl:w-[400px] h-[375px]"
          >
            <Image
              className="object-cover object-center"
              src={'/images/products/product1image1.jpg'}
              fill
              alt="product"
            />
          </div>
          <div
            id="product-description"
            className="flex flex-col p-[15px] mb-[100px] lg:w-[300px] xl:w-[550px] xl:px-[30px]"
          >
            <div id="product-name" className="font-semibold text-lg">
              {data.name}
            </div>
            <div
              id="product-price"
              className="text-xl font-semibold mt-[5px] mb-[15px] text-green-600"
            >
              {formatToRupiah(data.price)}
            </div>
            <hr />
            <div className="mt-[15px] font-semibold">Product Details</div>
            <div className="flex text-sm mt-[10px]">
              <div className=" w-1/2 text-gray-700">Condition</div>
              <div className=" w-1/2">New</div>
            </div>
            <div className="flex text-sm mt-[5px]">
              <div className=" w-1/2 text-gray-700">Status</div>
              <div className=" w-1/2">
                {data.totalStock > 0 ? 'Ready' : 'Out of stock'}
              </div>
            </div>
            <div className="flex text-sm mt-[5px] mb-[20px]">
              <div className=" w-1/2 text-gray-700">Category</div>
              <div className=" w-1/2">{data.productCategory.name}</div>
            </div>
            <hr />
            <div className="font-semibold mt-[15px]">Product Description</div>
            <div className="text-[15px] mt-[10px] text-justify">
              {data.description}
            </div>
          </div>
          <CartContainer
            data={data}
            price={data.price}
            totalStock={data.totalStock}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
