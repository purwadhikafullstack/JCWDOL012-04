'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { fetchData } from '@/utils/api';
import Image from 'next/image';

export default function ProductCategories() {
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const response = await fetchData('product-categories');
        setProductCategories(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProductCategories();
  }, []);

  return (
    <div className="w-full flex flex-col bg-gray-200 pt-[20px]">
      <div className="flex flex-col space-y-5 ml-[20px] lg:space-y-0 lg:flex-row lg:items-end lg:mx-auto lg:justify-between lg:w-[740px] xl:w-[1120px]">
        <div className="text-3xl font-semibold">All Products Categories</div>
        <Link href={'/admin/product-categories/product-categories-form'}>
          <div className="bg-[var(--primaryColor)] w-[200px] lg:w-auto text-white px-[17px] py-[10px] rounded-md font-semibold border cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] duration-200">
            + Add New Category
          </div>
        </Link>
      </div>
      <div className="flex flex-col mb-[200px] space-y-4 items-center mt-[40px]">
        {productCategories.map((procat, index) => {
          return (
            <Link href={`/admin/products?category=${procat.name}`} key={index}>
              <div
                id="product-categories-container"
                className="bg-gradient-to-r from-white to-purple-300 border h-[60px] flex items-center justify-between space-x-10 shadow-md w-[320px] md:w-[650px] lg:w-[750px] xl:w-[1120px] rounded-md px-[30px] hover:scale-105 duration-200"
              >
                <div className="flex items-center">
                  <div className="font-semibold w-[160px] lg:w-[200px] truncate">
                    #{procat.name}
                  </div>
                  <div className="hidden md:flex text-gray-600 w-[200px] lg:w-[260px] xl:w-[400px] truncate">
                    {procat.description}
                  </div>
                </div>
                <div id="update-delete" className="flex items-center space-x-3">
                  <div className="mr-[30px] hidden md:flex">
                    {new Date(procat.createdAt).toLocaleDateString()}
                  </div>
                  <Link href={`/admin/product-categories/${procat.id}`}>
                    <div className="border border-white p-[7px] rounded-md hover:scale-125 duration-200">
                      <div className="relative w-[15px] h-[15px]">
                        <Image
                          src={'/images/icon/pencil.png'}
                          fill
                          alt="edit"
                        />
                      </div>
                    </div>
                  </Link>
                  <div className="border border-white p-[7px] rounded-md hover:scale-125 duration-200">
                    <div className="relative w-[15px] h-[15px]">
                      <Image src={'/images/icon/delete.png'} fill alt="edit" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
