'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { formatToRupiah } from '@/utils/helper';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { Loading } from '@/components/Loading';
import { NotFound } from '@/components/NotFound';

export default function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const page = (searchParams.page || '1') as string;
  const pageSize = (searchParams.pageSize || '15') as string;
  const search = (searchParams.search || '') as string;
  const category = (searchParams.category || '') as string;
  const sort = (searchParams.sort || '') as string;

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
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, category, sort]);

  return (
    <div className="w-full flex flex-col bg-gray-200 pt-[20px]">
      <div className="flex flex-col space-y-5 ml-[20px] lg:space-y-0 lg:flex-row lg:items-end lg:mx-auto lg:justify-between lg:w-[740px] xl:w-[1120px]">
        <div className="text-3xl font-semibold">All Products</div>
        <Link href={'/admin/products/product-form'}>
          <div className="bg-[var(--primaryColor)] w-[200px] lg:w-auto text-white px-[17px] py-[10px] rounded-md font-semibold border cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] duration-200">
            + Add New Product
          </div>
        </Link>
      </div>
      <AdminSearchBar
        category={category}
        sort={sort}
        page={page}
        pageSize={pageSize}
        totalProducts={totalProducts}
      />
      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <NotFound />
      ) : (
        <div
          id="product-list-container"
          className="flex flex-wrap justify-center mx-auto px-[10px] mb-[100px] mt-[10px]  xl:px-[100px] max-w-[1440px]"
        >
          {products.map((product, index) => {
            return (
              <Link key={index} href={`/admin/products/${product.id}`}>
                <div
                  id="product-container"
                  className="flex flex-col w-[290px] lg:w-[360px] h-[210px] bg-white m-[10px] p-[15px] rounded-md shadow-md hover:bg-slate-100"
                >
                  <div
                    id="product-top"
                    className="flex h-[100px] items-center space-x-5"
                  >
                    <div
                      id="product-image"
                      className="relative w-[90px] h-[90px]"
                    >
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
