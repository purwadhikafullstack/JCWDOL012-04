'use client';

import { useState, useEffect } from 'react';
import { fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import Image from 'next/image';
import { formatToRupiah } from '@/utils/helper';

export default function Products() {
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const page = 1;
  const pageSize = 15;
  const search = '';
  const category = '';
  const sort = '';

  useEffect(() => {
    try {
      async function fetchProducts() {
        const response = await fetchData(
          `products?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`,
        );
        setProducts(response.products);
        setTotalProducts(response.totalProducts);
      }
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="w-full flex flex-col bg-gray-200 pt-[20px]">
      <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:items-end lg:mx-auto lg:justify-between lg:w-[1120px]">
        <div className="text-3xl font-semibold">All Products</div>
        <div className="bg-[var(--primaryColor)] w-[200px] lg:w-auto text-white px-[17px] py-[10px] rounded-md font-semibold border cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] duration-200">
          + Add New Product
        </div>
      </div>
      <div
        id="search-bar"
        className="bg-white w-full lg:w-[1120px] mx-auto h-[60px] mt-[30px] rounded-md"
      ></div>
      <div
        id="product-list-container"
        className="flex flex-wrap justify-center mx-auto px-[10px] mt-[10px] lg:px-[30px] xl:px-[100px] max-w-[1440px]"
      >
        {products.map((product, index) => {
          return (
            <div
              key={index}
              id="product-container"
              className="flex flex-col w-[300px] lg:w-[360px] h-[300px] bg-white m-[10px] p-[15px] rounded-md"
            >
              <div
                id="product-top"
                className="flex h-[100px] items-center space-x-5"
              >
                <div id="product-image" className="relative w-[90px] h-[90px]">
                  <Image
                    src={'/images/products/product1image1.jpeg'}
                    className="object-cover object-center"
                    fill
                    alt="productImage"
                  />
                </div>
                <div id="product-profile" className="flex flex-col">
                  <div className="font-semibold text-lg truncate">
                    {product.name}
                  </div>
                  <div className="text-gray-600">
                    {product.productCategory.name}
                  </div>
                  <div className="mt-[10px] font-bold">
                    {formatToRupiah(product.price)}
                  </div>
                </div>
              </div>
              <div
                id="product-desc"
                className="flex flex-col mt-[10px] justify-between h-[160px]"
              >
                <div>
                  <div className="font-semibold">Description</div>
                  <div>{product.description}</div>
                </div>
                <div
                  id="product-stock"
                  className="flex items-center justify-between font-semibold"
                >
                  <div>Remaining Stock : </div>
                  <div>{product.totalStock}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
