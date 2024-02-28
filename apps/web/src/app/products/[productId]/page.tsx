'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CartContainer } from '@/components/CartContainer';
import Loading from '@/components/Loading';
import { fetchData } from '@/utils/api';
import { formatToRupiah } from '@/utils/helper';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  totalStock: number;
  productCategory: {
    name: string;
  };
  productImages: {
    id: number;
    productId: number;
    path: string;
    createdAt: string;
    updatedAt: string;
    archived: boolean;
  }[];
}

interface ProductDetailsProps {
  params: {
    productId: string;
  };
}

export default function ProductDetails({ params }: ProductDetailsProps) {
  const [data, setData] = useState<Product | null>(null);
  const largeImageRef = useRef<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState(data?.productImages[0].path);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetchData(`product/${params.productId}`);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, [params.productId]);

  const changeLargeImage = (selectedSrc: string) => {
    if (largeImageRef.current) {
      largeImageRef.current.src = selectedSrc;
      setImgSrc(selectedSrc);
    }
  };

  return (
    <>
      {data ? (
        <div className="flex flex-col lg:flex-row lg:justify-center w-full lg:px-[20px] h-auto mt-[30px]">
          <div id="product-image" className="lg:w-[350px] xl:w-[400px]">
            <div className="relative w-full h-[375px] lg:border">
              {imgSrc ? (
                <Image
                  ref={largeImageRef}
                  className="object-cover object-center rounded-md"
                  src={imgSrc}
                  fill
                  alt="product"
                />
              ) : (
                <Image
                  ref={largeImageRef}
                  className="object-cover object-center"
                  src={`${data.productImages[0].path}`}
                  fill
                  alt="product"
                />
              )}
            </div>
            <div className="flex justify-center flex-wrap">
              {data.productImages.map((image, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      image.path === imgSrc ? 'border-2 border-[#8207c5]' : ''
                    } cursor-pointer hover:opacity-70 relative shadow-md border w-[70px] lg:w-[80px] h-[70px] lg:h-[80px] mx-[10px] mt-[15px]`}
                    onClick={() => {
                      changeLargeImage(image.path);
                    }}
                  >
                    <Image
                      className="object-cover object-center"
                      src={`${image.path}`}
                      fill
                      alt="minipics"
                    />
                  </div>
                );
              })}
            </div>
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
            <div className="flex text-sm mt-[5px]">
              <div className=" w-1/2 text-gray-700">Category</div>
              <div className=" w-1/2">{data.productCategory.name}</div>
            </div>
            <div className="flex text-sm mt-[5px]">
              <div className=" w-1/2 text-gray-700">Minimum Purchase</div>
              <div className=" w-1/2">1 Item</div>
            </div>
            <div className="flex text-sm mt-[5px] mb-[20px]">
              <div className=" w-1/2 text-gray-700">Maximum Purchase</div>
              <div className=" w-1/2">
                {Math.floor((data.totalStock * 30) / 100)} Items
              </div>
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
        <Loading />
      )}
    </>
  );
}
