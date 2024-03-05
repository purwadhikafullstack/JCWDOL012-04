'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchData } from '@/utils/api';
import { useDebounce } from 'use-debounce';
import { FilterSort } from './FilterSort';

interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

interface ProductName {
  name: string;
}

export const SearchBar = ({
  category,
  sort,
}: {
  category: string;
  sort: string;
}) => {
  const [search, setSearch] = useState('');
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    [],
  );
  const [productNames, setProductNames] = useState<ProductName[]>([]);
  const [debouncedSearch] = useDebounce(search, 500);
  const [isOpenFil, setIsOpenFil] = useState(false);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [isOpenSor, setIsOpenSor] = useState(false);
  const [isOpenPri, setIsOpenPri] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await fetchData(`product-categories`);
        setProductCategories(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCategories();
  }, []);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const response = await fetchData(
          `products/product-names?search=${debouncedSearch}`,
        );
        setProductNames(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (search) {
      fetchProductNames();
    }
  }, [debouncedSearch]);

  return (
    <nav className="flex fixed items-center w-full h-[70px] bg-white shadow-md border z-[10] space-x-2 lg:space-x-2 lg:px-[20px]">
      <div
        id="dummy"
        className="md:ml-[100px] lg:ml-[180px] xl:ml-[200px] 2xl:ml-[230px]"
      ></div>
      <div id="search" className="flex flex-1 items-center justify-center">
        <input
          className="border border-slate-300 focus:border-[var(--primaryColor)] w-0 flex-1 max-w-[370px] h-[40px] px-[20px] py-[20px] rounded-l-full"
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearch(e.target.value);
            setIsFocus(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.getElementById('search-button')?.click();
            }
          }}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsFocus(false);
            }, 100);
          }}
        />
        <Link
          href={`?page=1&pagesize=15&search=${search}`}
          onClick={() => {
            setIsFocus(false);
            setIsOpenCat(false);
            setIsOpenFil(false);
            setIsOpenPri(false);
            setIsOpenSor(false);
          }}
        >
          <button
            id="search-button"
            className="border border-slate-300 ml-[-1px] px-[12px] pr-[15px] py-[7.5px] rounded-r-full hover:border-[var(--primaryColor)] hover:border-[2px] cursor-pointer"
          >
            <div className="relative w-[25px] h-[25px]">
              <Image
                src={'/images/icon/search.png'}
                fill
                alt="search"
                sizes="25px"
              />
            </div>
          </button>
        </Link>
        <div
          id="search-suggestion"
          className={`${
            isFocus ? '' : 'hidden'
          } absolute flex flex-col bg-white w-[220px] md:w-[350px] md:mr-[35px] top-[60px] shadow-md rounded-md border`}
        >
          {productNames.map((product, index) => {
            return (
              <Link
                key={index}
                onClick={() => {
                  setIsFocus(false);
                }}
                href={`?page=1&pagesize=15&search=${product.name}`}
              >
                <div className="px-[20px] py-[7px] hover:bg-slate-200 cursor-pointer">
                  {product.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <FilterSort
        search={search}
        isOpenFil={isOpenFil}
        setIsOpenFil={setIsOpenFil}
        isOpenCat={isOpenCat}
        setIsOpenCat={setIsOpenCat}
        isOpenSor={isOpenSor}
        setIsOpenSor={setIsOpenSor}
        isOpenPri={isOpenPri}
        setIsOpenPri={setIsOpenPri}
        category={category}
        sort={sort}
        productCategories={productCategories}
        setProductCategories={setProductCategories}
      />
    </nav>
  );
};
