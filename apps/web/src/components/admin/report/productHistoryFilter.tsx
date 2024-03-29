'use client';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { summaryDate } from '@/utils/helper';
import Link from 'next/link';
import Image from 'next/image';

interface ProductHistoryFilterProps {
  role: string;
  warehouse: string;
  product: string;
  startMonth: string;
  endMonth: string;
}

export const ProductHistoryFilter: React.FC<ProductHistoryFilterProps> = (
  props,
) => {
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [isOpenWare, setIsOpenWare] = useState<boolean>(false);
  const [isOpenPro, setIsOpenPro] = useState<boolean>(false);
  const [isOpenRange, setIsOpenRange] = useState<boolean>(false);
  const dateRange = summaryDate();
  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const response = await fetchData('admin/product-warehouses');
        setWarehouses(response);
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
    fetchProducts();
  }, []);
  return (
    <div className="flex items-center space-x-3">
      <div className="relative flex items-center justify-between space-x-4">
        {props.role === 'SUPER_ADMIN' ? (
          <div
            className={`flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150`}
            onClick={() => {
              setIsOpenWare(!isOpenWare);
              setIsOpenRange(false);
              setIsOpenPro(false);
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
              } z-10 absolute flex flex-col font-normal top-10 left-[-30px] md:left-[-35px] border w-[185px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto`}
            >
              {warehouses.map((ware, index) => {
                return (
                  <Link
                    href={`?warehouseHis=${ware.name}&productHis=${props.product}&startMonthHis=${props.startMonth}&endMonthHis=${props.endMonth}`}
                    scroll={false}
                    key={index}
                    onClick={() => {
                      setIsOpenWare(false);
                    }}
                  >
                    <div
                      className={`${
                        ware.name === props.warehouse
                          ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate'
                          : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate'
                      }`}
                    >
                      {ware.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <div
        className="relative flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150"
        onClick={() => {
          setIsOpenPro(!isOpenPro);
          setIsOpenWare(false);
          setIsOpenRange(false);
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
          {products.map((prod, index) => {
            return (
              <Link
                href={`?warehouseHis=${props.warehouse}&productHis=${prod.name}&startMonthHis=${props.startMonth}&endMonthHis=${props.endMonth}`}
                key={index}
                scroll={false}
                onClick={() => {
                  setIsOpenPro(false);
                }}
              >
                <div
                  className={`${
                    prod.name === props.product
                      ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate'
                      : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate'
                  }`}
                >
                  {prod.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="relative flex items-center justify-between space-x-4">
        <div
          className={`flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150`}
          onClick={() => {
            setIsOpenRange(!isOpenRange);
            setIsOpenWare(false);
            setIsOpenPro(false);
          }}
        >
          <div className="font-medium">Range</div>
          <div className="relative w-3 h-3">
            <Image
              src={
                isOpenRange
                  ? '/images/icon/arrow-up.png'
                  : '/images/icon/arrow-down.png'
              }
              fill
              alt="arrow"
            />
          </div>
          <div
            id="drop-range"
            className={`${
              isOpenRange ? '' : 'hidden'
            } z-10 absolute flex flex-col font-normal top-10 left-[-130px] md:left-[-140px] xl:left-[-90px] border w-[250px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto`}
          >
            {dateRange.map((date, index) => {
              return (
                <Link
                  href={`?warehouseHis=${props.warehouse}&product=${
                    props.product
                  }&startMonthHis=${index + 1}&endMonthHis=${index}`}
                  scroll={false}
                  key={index}
                  onClick={() => {
                    setIsOpenRange(false);
                  }}
                >
                  <div
                    className={`${
                      Number(props.startMonth) === index + 1
                        ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px] truncate text-center'
                        : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px] truncate text-center'
                    }`}
                  >
                    {date}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
