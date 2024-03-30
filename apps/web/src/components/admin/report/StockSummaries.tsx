'use client';

import { fetchData } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WarehousesModel } from '@/model/WarehousesModel';
import { summaryDate } from '@/utils/helper';

interface summaries {
  id: number;
  name: string;
  add: number;
  min: number;
  stock: number;
}

export const StockSummaries = ({
  searchParams,
  role,
  adminWarehouseId,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  role: string | undefined;
  adminWarehouseId: number | undefined;
}) => {
  const [summaries, setSummaries] = useState<summaries[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [warehouseName, setWarehouseName] = useState<string>('');
  const [isOpenWare, setIsOpenWare] = useState<boolean>(false);
  const [isOpenRange, setIsOpenRange] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const page = searchParams.pageSum || '1';
  const pageSize = searchParams.pageSizeSum || '15';
  const warehouse = searchParams.warehouseSum || '';
  const warehouseId = searchParams.warehouseId;
  const startMonth = searchParams.startMonthSum || '1';
  const endMonth = searchParams.endMonthSum || '0';
  const hasNextPage = total > Number(page) * 15;
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
    async function fetchWarehouse() {
      try {
        const response = await fetchData(
          `admin/product-warehouses/${adminWarehouseId}`,
        );
        setWarehouseName(response.name);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchSummaries() {
      try {
        const response = await fetchData(
          role === 'SUPER_ADMIN'
            ? `report/stocks?page=${page}&pageSize=${pageSize}&startMonth=${startMonth}&endMonth=${endMonth}&warehouse=${warehouse}&warehouseId=${warehouseId}`
            : `report/stocks?page=${page}&pageSize=${pageSize}&startMonth=${startMonth}&endMonth=${endMonth}&warehouse=${warehouseName}&warehouseId=${adminWarehouseId}`,
        );
        setSummaries(response.monthlyAdd);
        setTotal(response.totalProducts);
      } catch (error) {
        console.log(error);
      }
    }
    role === 'WAREHOUSE_ADMIN'
      ? (fetchWarehouse(), warehouseName ? fetchSummaries() : '')
      : (fetchWarehouses(), fetchSummaries());
  }, [
    page,
    pageSize,
    startMonth,
    endMonth,
    warehouse,
    warehouseId,
    adminWarehouseId,
    role,
    warehouseName,
  ]);
  return (
    <main>
      <div className="max-w-3xl w-full mx-auto mt-20 px-5 md:px-0">
        <div className="flex items-center flex-col space-y-3 md:space-y-0 md:flex-row justify-between">
          <div className="text-3xl font-medium">Stock Summaries</div>
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-between space-x-4">
              {role === 'SUPER_ADMIN' ? (
                <div
                  className={`flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150`}
                  onClick={() => {
                    setIsOpenWare(!isOpenWare);
                    setIsOpenRange(false);
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
                          href={`?warehouseSum=${ware.name}&warehouseId=${ware.id}`}
                          scroll={false}
                          key={index}
                          onClick={() => {
                            setIsOpenWare(false);
                          }}
                        >
                          <div
                            className={`${
                              ware.name === warehouse
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
            <div className="relative flex items-center justify-between space-x-4">
              <div
                className={`flex items-center space-x-2 border border-slate-400 px-3 py-1 rounded-md hover:bg-slate-200 cursor-pointer duration-150`}
                onClick={() => {
                  setIsOpenRange(!isOpenRange);
                  setIsOpenWare(false);
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
                  } z-10 absolute flex flex-col font-normal top-10 left-[-80px] md:left-[-140px] xl:left-[-90px] border w-[250px] bg-[white] shadow-md rounded-md max-h-[300px] overflow-y-auto`}
                >
                  {dateRange.map((date, index) => {
                    return (
                      <Link
                        href={`?warehouseSum=${warehouse}&warehouseId=${
                          warehouseId || ''
                        }&startMonthSum=${index + 1}&endMonthSum=${index}`}
                        scroll={false}
                        key={index}
                        onClick={() => {
                          setIsOpenRange(false);
                        }}
                      >
                        <div
                          className={`${
                            Number(startMonth) === index + 1
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
        </div>
        <table className="table-auto shadow-md mt-10 w-full rounded-md">
          <thead className="bg-gray-300 text-left">
            <tr>
              <th className="py-3 pl-8 rounded-tl-md">Product</th>
              <th className="py-3 px-1">Addition</th>
              <th className="py-3 px-1">Subtraction</th>
              <th className="py-3 px-1 rounded-tr-md">Stock</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {summaries.map((summary, index) => {
              return (
                <tr key={index}>
                  <td className="py-3 pl-8">{summary.name}</td>
                  <td className="py-3 px-1 text-green-600">+{summary.add}</td>
                  <td className="py-3 px-1 text-red-600">-{summary.min}</td>
                  <td className="py-3 px-1">{summary.stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex">
          <div
            id="pagination"
            className="flex items-center mx-auto mt-10 border border-slate-300 rounded"
          >
            <Link
              href={
                role === 'SUPER_ADMIN'
                  ? `?pageSum=${
                      Number(page) - 1
                    }&pageSizeSum=${pageSize}&warehouseSum=${warehouse}&warehouseId=${
                      warehouseId || ''
                    }&startMonthSum=${startMonth}&endMonthSum=${endMonth}`
                  : `?pageSum=${
                      Number(page) - 1
                    }&pageSizeSum=${pageSize}&startMonthSum=${startMonth}&endMonthSum=${endMonth}`
              }
              scroll={false}
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
            <div className="bg-white text-black border-r border-l w-[30px] text-center pointer-events-none">
              {page}
            </div>
            <Link
              href={
                role === 'SUPER_ADMIN'
                  ? `?pageSum=${
                      Number(page) + 1
                    }&pageSizeSum=${pageSize}&warehouseSum=${warehouse}&warehouseId=${
                      warehouseId || ''
                    }&startMonthSum=${startMonth}&endMonthSum=${endMonth}`
                  : `?pageSum=${
                      Number(page) + 1
                    }&pageSizeSum=${pageSize}&startMonthSum=${startMonth}&endMonthSum=${endMonth}`
              }
              scroll={false}
              className={`${
                hasNextPage ? '' : 'opacity-50 pointer-events-none'
              }`}
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
    </main>
  );
};
