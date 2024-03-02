'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchData } from '@/utils/api';
import { useDebounce } from 'use-debounce';

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
          className="border w-0 flex-1 max-w-[370px] h-[40px] px-[20px] py-[20px] rounded-l-full focus:outline-[#8207C5]"
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
          }}
        >
          <button
            id="search-button"
            className="border ml-[-1px] px-[12px] pr-[15px] py-[7.5px] rounded-r-full hover:border-[#8207C5] cursor-pointer"
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
      <div id="filter-sort" className="flex items-center font-semibold">
        <div
          id="filter"
          className="flex items-center lg:space-x-2 cursor-pointer hover:bg-slate-200 px-[10px] py-[5px] lg:px-[15px] lg:py-[10px] duration-200 rounded-md"
          onClick={() => {
            setIsOpenFil(!isOpenFil);
            setIsOpenSor(false);
            setIsOpenPri(false);
            if (isOpenCat) {
              setIsOpenCat(false);
              setIsOpenFil(false);
            }
          }}
        >
          <div className="hidden lg:flex">Filter</div>
          <div className="relative w-[20px] h-[20px]">
            <Image
              src={'/images/icon/filter.png'}
              fill
              alt="filter"
              sizes="20px"
            />
          </div>
        </div>
        <div
          id="drop-filter"
          className={`${
            isOpenFil ? '' : 'hidden'
          } absolute flex flex-col font-normal border mt-[90px] right-[105px] px-[20px] py-[10px] bg-[white] shadow-md rounded-md hover:bg-slate-200 cursor-pointer`}
          onClick={() => {
            setIsOpenFil(!isOpenFil);
            setIsOpenCat(!isOpenCat);
          }}
        >
          Category
        </div>
        <div
          id="drop-category"
          className={`${
            isOpenCat ? '' : 'hidden'
          } absolute flex flex-col font-normal border mt-[230px] right-[70px] bg-[white] shadow-md rounded-md`}
        >
          {productCategories.map((procat, index) => {
            return (
              <Link
                href={`?page=1&pagesize=15&search=${search}&category=${procat.name}`}
                key={index}
                className={`${
                  procat.name === category
                    ? 'bg-[#8207C5] hover:bg-[#8207C5] text-white'
                    : ''
                } hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]`}
                onClick={() => {
                  setIsOpenCat(false);
                }}
              >
                {procat.name}
              </Link>
            );
          })}
        </div>
        <div
          id="sort"
          className="flex items-center lg:space-x-2 cursor-pointer hover:bg-slate-200 px-[10px] py-[5px] lg:px-[15px] lg:py-[10px] duration-200 rounded-md"
          onClick={() => {
            setIsOpenSor(!isOpenSor);
            setIsOpenFil(false);
            setIsOpenCat(false);
            if (isOpenPri) {
              setIsOpenPri(false);
              setIsOpenSor(false);
            }
          }}
        >
          <div className="hidden lg:flex">Sort</div>
          <div className="relative w-[20px] h-[20px]">
            <Image src={'/images/icon/sort.png'} fill alt="sort" sizes="20px" />
          </div>
        </div>
        <div
          id="drop-sort"
          className={`${
            isOpenSor ? '' : 'hidden'
          } absolute flex flex-col font-normal border mt-[90px] right-[18px] px-[28px] py-[10px] bg-[white] shadow-md rounded-md hover:bg-slate-200 cursor-pointer`}
          onClick={() => {
            setIsOpenSor(!isOpenSor);
            setIsOpenPri(!isOpenPri);
          }}
        >
          Price
        </div>
        <div
          id="drop-price"
          className={`${
            isOpenPri ? '' : 'hidden'
          } absolute flex flex-col font-normal border mt-[120px] right-[0px] bg-[white] shadow-md rounded-md`}
          onClick={() => {
            setIsOpenPri(false);
          }}
        >
          <Link
            href={`?page=1&pagesize=15&search=${search}&category=${category}&sort=asc`}
          >
            <div
              className={`${
                sort === 'asc'
                  ? 'bg-[#8207C5] hover:bg-[#8207C5] text-white'
                  : ''
              } hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]`}
            >
              Lowest Price
            </div>
          </Link>
          <Link
            href={`?page=1&pagesize=15&search=${search}&category=${category}&sort=desc`}
          >
            <div
              className={`${
                sort === 'desc'
                  ? 'bg-[#8207C5] hover:bg-[#8207C5] text-white'
                  : ''
              } hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]`}
            >
              Highest Price
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
