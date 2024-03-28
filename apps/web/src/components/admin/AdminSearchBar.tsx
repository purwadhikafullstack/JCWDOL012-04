'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { useState, useEffect } from 'react';
import { fetchData } from '@/utils/api';

export const AdminSearchBar = ({
  category,
  sort,
  page,
  pageSize,
  totalProducts,
}: {
  category: string;
  sort: string;
  page: string;
  pageSize: string;
  totalProducts: number;
}) => {
  const [search, setSearch] = useState('');
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [isOpenPri, setIsOpenPri] = useState(false);
  const hasNextPage = totalProducts - Number(page) * Number(pageSize) > 0;

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

  return (
    <div
      id="search-bar"
      className="bg-white flex items-center justify-between px-[10px] md:px-[20px] sticky top-[0px] md:top-[-33px] shadow-md z-10 w-full lg:w-[660px] xl:w-[1000px] 2xl:w-[1120px] mx-auto h-[60px] mt-[30px] lg:rounded-md"
    >
      <div id="search-left" className="flex items-center flex-1">
        <input
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              document.getElementById('search-button')?.click();
            }
          }}
          placeholder="Search"
          className="h-[30px] rounded border-slate-300 flex-1 w-0 max-w-[335px]"
        />
        <Link href={`?page=1&pagesize=15&search=${search}`}>
          <button
            id="search-button"
            className="border border-slate-300 rounded-md ml-[10px] px-[8px] py-[4px] hover:bg-slate-300 duration-200"
            onClick={() => {
              setIsOpenCat(false);
              setIsOpenPri(false);
            }}
          >
            <div className="relative w-[20px] h-[20px]">
              <Image src={'/images/icon/search.png'} fill alt="search" />
            </div>
          </button>
        </Link>
        <div
          onClick={() => {
            setIsOpenCat(!isOpenCat);
            setIsOpenPri(false);
          }}
          className="border hidden md:flex items-center space-x-1 border-slate-300 md:ml-[20px] px-[15px] py-[3px] rounded cursor-pointer hover:bg-slate-200 duration-200"
        >
          <div>Category</div>
          <div className="relative w-[10px] h-[10px]">
            <Image src={'/images/icon/arrow-down.png'} fill alt="arrow-down" />
          </div>
        </div>
        <div
          id="product-categories-container"
          className={`${
            isOpenCat ? '' : 'hidden'
          }  absolute flex flex-col bg-white top-[55px] w-[172px] shadow-md border right-0 md:right-[200px] lg:right-[205px] xl:right-[435px] 2xl:right-[555px] rounded-md max-h-[300px] overflow-y-auto overflow-x-hidden`}
        >
          {productCategories.map((procat, index) => {
            return (
              <Link
                key={index}
                href={`?page=1&pagesize=15&search=${search}&category=${procat.name}`}
                onClick={() => {
                  setIsOpenCat(false);
                }}
              >
                <div
                  className={`${
                    category === procat.name
                      ? 'bg-[var(--primaryColor)] truncate text-white px-[15px] py-[7px] cursor-pointer hover:bg-purple-600'
                      : 'px-[15px] py-[7px] cursor-pointer truncate hover:bg-slate-300'
                  }`}
                >
                  {procat.name}
                </div>
              </Link>
            );
          })}
        </div>
        <div
          className="relative w-[20px] h-[20px] md:hidden ml-[20px] mx-[10px]"
          onClick={() => {
            setIsOpenCat(!isOpenCat);
            setIsOpenPri(false);
          }}
        >
          <Image src={'/images/icon/filter.png'} fill alt="filter" />
        </div>
        <div
          className="hidden md:flex border items-center space-x-1 border-slate-300 md:mr-[20px] md:ml-[20px] px-[15px] py-[3px] rounded cursor-pointer hover:bg-slate-200 duration-200"
          onClick={() => {
            setIsOpenPri(!isOpenPri);
            setIsOpenCat(false);
          }}
        >
          <div>Sort</div>
          <div className="relative w-[10px] h-[10px]">
            <Image src={'/images/icon/arrow-down.png'} fill alt="arrow-down" />
          </div>
        </div>
        <div
          className={`absolute bg-white flex flex-col rounded-md border shadow-md top-[55px] right-0 md:right-[106px] xl:right-[340px] 2xl:right-[455px] ${
            isOpenPri ? '' : 'hidden'
          }`}
        >
          <Link
            href={`?page=1&pagesize=15&search=${search}&category=${category}&sort=asc`}
            onClick={() => {
              setIsOpenPri(false);
            }}
          >
            <div
              className={`${
                sort === 'asc'
                  ? 'bg-[var(--primaryColor)] text-white px-[15px] py-[7px] cursor-pointer hover:bg-purple-600'
                  : 'px-[15px] py-[7px] cursor-pointer hover:bg-slate-300'
              }`}
            >
              Lowest Price
            </div>
          </Link>
          <Link
            href={`?page=1&pagesize=15&search=${search}&category=${category}&sort=desc`}
            onClick={() => {
              setIsOpenPri(false);
            }}
          >
            <div
              className={`${
                sort === 'desc'
                  ? 'bg-[var(--primaryColor)] text-white px-[15px] py-[7px] cursor-pointer hover:bg-purple-600'
                  : 'px-[15px] py-[7px] cursor-pointer hover:bg-slate-300'
              }`}
            >
              Highest Price
            </div>
          </Link>
        </div>
        <div
          className="relative w-[20px] h-[20px] md:hidden mx-[10px]"
          onClick={() => {
            setIsOpenPri(!isOpenPri);
            setIsOpenCat(false);
          }}
        >
          <Image src={'/images/icon/sort.png'} fill alt="filter" />
        </div>
      </div>
      <div id="search-right" className="hidden md:flex">
        <div
          id="pagination"
          className="flex items-center border border-slate-300 rounded"
        >
          <Link
            href={`?page=${
              Number(page) - 1
            }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
            className={`${
              Number(page) < 2 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="px-[8px] cursor-pointer hover:opacity-70">
              <div className="relative w-[15px] h-[15px]">
                <Image src={'/images/icon/left-arrow.png'} fill alt="left" />
              </div>
            </div>
          </Link>
          <div className="bg-slate-200 border-r border-l w-[30px] text-center pointer-events-none">
            {page}
          </div>
          <Link
            href={`?page=${
              Number(page) + 1
            }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
            className={`${hasNextPage ? '' : 'opacity-50 pointer-events-none'}`}
          >
            <div className="px-[8px] cursor-pointer hover:opacity-70">
              <div className="relative w-[15px] h-[15px]">
                <Image src={'/images/icon/right-arrow.png'} fill alt="left" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
