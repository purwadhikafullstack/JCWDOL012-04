'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/api';
import { WarehousesModel } from '@/model/WarehousesModel';
import Image from 'next/image';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { ProductsModel } from '@/model/ProductsModel';
import Link from 'next/link';

interface SalesFilterProps {
  warehouse: string;
  category: string;
  product: string;
}

export const SalesFilter: React.FC<SalesFilterProps> = (props) => {
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [categories, setCategories] = useState<ProductCategoriesModel[]>([]);
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [isOpenWare, setIsOpenWare] = useState<boolean>(false);
  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [isOpenPro, setIsOpenPro] = useState<boolean>(false);
  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const response = await fetchData('admin/product-warehouses');
        setWarehouses(response);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchCategories() {
      try {
        const response = await fetchData('/product-categories');
        setCategories(response);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchProducts() {
      try {
        const response = await fetchData('products/product-all-names');
        setProducts(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWarehouses();
    fetchCategories();
    fetchProducts();
  }, []);
  console.log(products);
  return (
    <div className="relative flex items-center space-x-4">
      <div
        className="flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150"
        onClick={() => {
          setIsOpenWare(!isOpenWare);
          setIsOpenCat(false);
          setIsOpenPro(false);
        }}
      >
        <div className="font-medium">Warehouse</div>
        <div className="relative w-3 h-3">
          <Image src={'/images/icon/arrow-down.png'} fill alt="arrow" />
        </div>
        <div
          id="drop-warehouses"
          className={`${
            isOpenWare ? '' : 'hidden'
          } z-10 absolute flex flex-col font-normal top-10 left-[-10px] md:left-[-35px] border w-[185px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto`}
        >
          {warehouses.map((warehouse, index) => {
            return (
              <Link
                href={`?warehouse=${warehouse.name}&productCategory=${props.category}&product=${props.product}`}
                key={index}
                className={`${
                  warehouse.name === props.warehouse
                    ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate'
                    : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate'
                }`}
                onClick={() => {
                  setIsOpenWare(false);
                }}
              >
                {warehouse.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div
        className="relative flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150"
        onClick={() => {
          setIsOpenCat(!isOpenCat);
          setIsOpenWare(false);
          setIsOpenPro(false);
        }}
      >
        <div className="font-medium">Category</div>
        <div className="relative w-3 h-3">
          <Image src={'/images/icon/arrow-down.png'} fill alt="arrow" />
        </div>
        <div
          id="drop-warehouses"
          className={`${
            isOpenCat ? '' : 'hidden'
          } z-10 absolute flex flex-col font-normal top-10 left-[-35px] border w-[185px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto`}
        >
          {categories.map((category, index) => {
            return (
              <Link
                href={`?warehouse=${props.warehouse}&productCategory=${category.name}&product=${props.product}`}
                key={index}
                className={`${
                  category.name === props.category
                    ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate'
                    : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate'
                }`}
                onClick={() => {
                  setIsOpenCat(false);
                }}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div
        className="relative flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150"
        onClick={() => {
          setIsOpenCat(false);
          setIsOpenWare(false);
          setIsOpenPro(!isOpenPro);
        }}
      >
        <div className="font-medium">Product</div>
        <div className="relative w-3 h-3">
          <Image src={'/images/icon/arrow-down.png'} fill alt="arrow" />
        </div>
        <div
          id="drop-products"
          className={`${
            isOpenPro ? '' : 'hidden'
          } z-10 absolute flex flex-col top-10 left-[-45px] border w-[185px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto overflow-x-hidden`}
        >
          {products.map((product, index) => {
            return (
              <Link
                href={`?warehouse=${props.warehouse}&productCategory=${props.category}&product=${product.name}`}
                key={index}
                onClick={() => {
                  setIsOpenCat(false);
                }}
              >
                <div
                  className={`${
                    product.name === props.product
                      ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate'
                      : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate'
                  }`}
                >
                  {product.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
