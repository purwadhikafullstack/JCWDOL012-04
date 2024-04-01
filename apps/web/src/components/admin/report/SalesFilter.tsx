'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/api';
import { WarehousesModel } from '@/model/WarehousesModel';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { ProductsModel } from '@/model/ProductsModel';
import { months } from '@/utils/helper';
import Image from 'next/image';
import Link from 'next/link';

interface SalesFilterProps {
  warehouse: string;
  category: string;
  product: string;
  role: string | undefined;
  adminWarehouseId: number | undefined;
  startMonth: string;
}

export const SalesFilter: React.FC<SalesFilterProps> = (props) => {
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [categories, setCategories] = useState<ProductCategoriesModel[]>([]);
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [isOpenWare, setIsOpenWare] = useState<boolean>(false);
  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [isOpenPro, setIsOpenPro] = useState<boolean>(false);
  const [isOpenMon, setIsOpenMon] = useState<boolean>(false);

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
  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex items-center justify-between space-x-4">
        {props.role === 'SUPER_ADMIN' ? (
          <div
            className={`flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150`}
            onClick={() => {
              setIsOpenWare(!isOpenWare);
              setIsOpenCat(false);
              setIsOpenPro(false);
              setIsOpenMon(false);
            }}
          >
            <div className="font-medium">Warehouse</div>
            <div className="relative w-3 h-3">
              <Image
                src={
                  isOpenWare
                    ? '/images/icon/arrow-up.png'
                    : '/images/icon/arrow-down.png'
                }
                fill
                alt="arrow"
              />
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
                    href={`?warehouse=${warehouse.name}&productCategory=${props.category}&product=${props.product}&startMonth=${props.startMonth}`}
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
        ) : (
          ''
        )}
        <div
          className="relative flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150"
          onClick={() => {
            setIsOpenCat(!isOpenCat);
            setIsOpenWare(false);
            setIsOpenPro(false);
            setIsOpenMon(false);
          }}
        >
          <div className="font-medium">Category</div>
          <div className="relative w-3 h-3">
            <Image
              src={
                isOpenCat
                  ? '/images/icon/arrow-up.png'
                  : '/images/icon/arrow-down.png'
              }
              fill
              alt="arrow"
            />
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
                  href={`?warehouse=${props.warehouse}&productCategory=${category.name}&startMonth=${props.startMonth}`}
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
            setIsOpenPro(!isOpenPro);
            setIsOpenCat(false);
            setIsOpenWare(false);
            setIsOpenMon(false);
          }}
        >
          <div className="font-medium">Product</div>
          <div className="relative w-3 h-3">
            <Image
              src={
                isOpenPro
                  ? '/images/icon/arrow-up.png'
                  : '/images/icon/arrow-down.png'
              }
              fill
              alt="arrow"
            />
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
                  href={`?warehouse=${props.warehouse}&product=${product.name}&startMonth=${props.startMonth}`}
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
      <div
        className="relative border border-slate-400 px-3 py-1 rounded hover:bg-slate-200 duration-150 cursor-pointer"
        onClick={() => {
          setIsOpenMon(!isOpenMon);
          setIsOpenCat(false);
          setIsOpenWare(false);
          setIsOpenPro(false);
        }}
      >
        <div className="flex items-center space-x-2 justify-center">
          <div className="flex items-center">
            Last {Number(props.startMonth) > 1 ? props.startMonth : ''} Month{' '}
          </div>
          <div className="relative w-3 h-3">
            <Image
              src={
                isOpenMon
                  ? '/images/icon/arrow-up.png'
                  : '/images/icon/arrow-down.png'
              }
              fill
              alt="arrow-down"
            />{' '}
          </div>
        </div>
        <div
          className={`${
            isOpenMon ? '' : 'hidden'
          } z-10 absolute bg-white shadow-md rounded-md border ${
            props.role === 'SUPER_ADMIN' ? 'w-[370px]' : 'w-[220px]'
          } top-10 max-h-60 overflow-y-auto`}
        >
          {months.map((month, index) => {
            return (
              <Link
                key={index}
                href={`?warehouse=${props.warehouse}&productCategory=${
                  props.category
                }&product=${props.product}&startMonth=${index + 1}`}
              >
                <div
                  className={`${
                    Number(props.startMonth) === index + 1
                      ? 'bg-[var(--primaryColor)] text-white px-3 py-2'
                      : 'px-3 py-2 hover:bg-slate-200 cursor-pointer duration-150'
                  }`}
                >
                  {month}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
