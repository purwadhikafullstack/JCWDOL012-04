'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatToRupiah } from '@/utils/helper';
import { fetchData } from '@/utils/api';
import { Loading } from '@/components/Loading';
import { SearchBar } from '@/components/searchBar/SearchBar';
import { NotFound } from '@/components/NotFound';
import HeroCarousel from '../image-carousel/hero-section';
import LineWithText from '../ui/line';
import { ProductsModel } from '@/model/ProductsModel';

export default function ProductList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [data, setData] = useState<ProductsModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const page = (searchParams.page || '1') as string;
  const pageSize = (searchParams.pageSize || '15') as string;
  const search = (searchParams.search || '') as string;
  const category = (searchParams.category || '') as string;
  const sort = (searchParams.sort || '') as string;
  const hasNextPage = totalProducts - Number(page) * Number(pageSize) > 0;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetchData(
          `products?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`,
        );
        setData(response.products);
        setTotalProducts(response.totalProducts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [page, pageSize, search, category, sort]);

  if (isLoading) {
    return (
      <>
        <SearchBar category={category} sort={sort} />
        <Loading />;
      </>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <SearchBar category={category} sort={sort} />
        <NotFound />
      </>
    );
  }

  return (
    <>
      <SearchBar category={category} sort={sort} />
      <div className="flex flex-col justify-center items-center mx-auto pt-[20px] md:pt-[95px] max-w-[1024px]">
        <HeroCarousel />
        <LineWithText text=" " />
      </div>
      <div
        id="products-container"
        className="flex flex-wrap min-h-[700px] justify-center mx-auto px-[10px] pt-[85px] lg:px-[30px] xl:px-[100px] max-w-[1440px]"
      >
        {data.map((product, index) => {
          return (
            <Link key={index} href={`/products/${product.id}`}>
              <div
                id="product"
                className="flex flex-col w-[150px] xl:w-[180px] h-[205px] rounded-md shadow-md border m-[10px] xl:my-[20px] xl:mx-[15px] bg-white hover:bg-slate-200 duration-200"
              >
                <div id="product-image" className="relative w-full h-[120px]">
                  {/* <Image
                    className="object-cover object-center"
                    src={`${product.productImages[0].path}`}
                    fill
                    alt="productimage"
                  /> */}
                  <Image
                    className="object-cover object-center"
                    src={`/images/products/product1image1.jpeg`}
                    fill
                    alt="productimage"
                  />
                </div>
                <div
                  id="product-desc"
                  className="flex flex-col px-[10px] pt-[5px] text-[14px] border-t"
                >
                  <div id="product-name" className="font-semibold truncate">
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
                            ? '/images/icon/box.png'
                            : '/images/icon/warning.png'
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
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div
        id="pagination"
        className="mt-[30px] mb-[100px] flex justify-center items-center space-x-3"
      >
        <Link
          href={`?page=${
            Number(page) - 1
          }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
          className={`hover:opacity-80 ${
            Number(page) > 1 ? '' : 'pointer-events-none opacity-70'
          }`}
        >
          <div className="relative w-[30px] h-[30px] ">
            <Image src={'/images/icon/left-arrow.svg'} fill alt="prev" />
          </div>
        </Link>
        <div className="text-lg">
          <span className="mr-[5px]">{page}</span>/
          <span className="ml-[5px]">
            {Math.ceil(totalProducts / Number(pageSize))}
          </span>
        </div>
        <Link
          href={`?page=${
            Number(page) + 1
          }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
          className={`hover:opacity-80 ${
            hasNextPage ? '' : 'pointer-events-none opacity-70'
          }`}
        >
          <div className="relative w-[30px] h-[30px]">
            <Image src={'/images/icon/right-arrow.svg'} fill alt="next" />
          </div>
        </Link>
      </div>
    </>
  );
}
