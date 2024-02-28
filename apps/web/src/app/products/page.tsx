'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatToRupiah } from '@/utils/helper';
import { fetchData } from '@/utils/api';
import Loading from '@/components/Loading';

interface Product {
  id: number;
  name: string;
  price: number;
  totalStock: number;
  productCategory: {
    name: string;
  };
}

export default function Products() {
  const [data, setData] = useState<Product[]>([]);

  async function fetchProducts() {
    try {
      const response = await fetchData('products');
      setData(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {data ? (
        <div
          id="products-container"
          className="flex flex-wrap justify-center mx-auto px-[10px] lg:px-[30px] xl:px-[50px] max-w-[1440px]"
        >
          {data.map((product, index) => {
            return (
              <Link key={index} href={`/products/${product.id}`}>
                <div
                  id="product"
                  className="flex flex-col w-[150px] xl:w-[180px] h-[215px] rounded-md shadow-md border m-[10px] xl:my-[20px] xl:mx-[15px]"
                >
                  <div id="product-image" className="relative w-full h-[120px]">
                    {/* <Image
                className="object-cover object-center"
                src={`${product.productImages[0].path}`}
                fill
                alt="a"
              /> */}
                    <Image
                      className="object-cover object-center"
                      src={`/images/products/product1image1.jpeg`}
                      fill
                      alt="a"
                    />
                  </div>
                  <div
                    id="product-desc"
                    className="flex flex-col px-[10px] pt-[5px] text-[14px]"
                  >
                    <div
                      id="product-name"
                      className="font-semibold truncate mt-[10px]"
                    >
                      {product.name}
                    </div>
                    <div className="text-green-600 text-[13px] font-semibold truncate">
                      {formatToRupiah(product.price)}
                    </div>
                    <div className="flex mt-[8px] text-[13px] items-center space-x-1">
                      <div className="relative w-[18px] h-[18px]">
                        <Image
                          src={
                            product.totalStock > 0
                              ? '/images/icons/box.png'
                              : '/images/icons/warning.png'
                          }
                          fill
                          alt="box"
                        />
                      </div>
                      <div
                        className={`truncate ${
                          product.totalStock > 0 ? 'text-black' : 'text-red-600'
                        }`}
                      >
                        {product.totalStock > 0
                          ? product.totalStock + ' Items left'
                          : 'Out of stock'}
                      </div>
                    </div>
                    <div className="absolute  mt-[-16px] ml-[-10px] pl-[10px] pr-[11px] text-xs bg-[#8207c5] text-white p-1 rounded-r-full">
                      {product.productCategory.name}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
