'use client';

import { fetchData } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WarehousesModel } from '@/model/WarehousesModel';
import { summaryDate } from '@/utils/helper';
import { MutationsModel } from '@/model/MutationsModel';
import { ProductsModel } from '@/model/ProductsModel';
import { ProductHistoryFilter } from './productHistoryFilter';

export const ProductHistory = ({
  searchParams,
  role,
  adminWarehouseId,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  role: string | undefined;
  adminWarehouseId: number | undefined;
}) => {
  const [history, setHistory] = useState<MutationsModel[]>([]);

  const [warehouseName, setWarehouseName] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const page = searchParams.pageHis || '1';
  const pageSize = searchParams.pageSizeHis || '15';
  const warehouse = searchParams.warehouseHis || '';
  const product = searchParams.productHis || '';
  const startMonth = searchParams.startMonthHis || '1';
  const endMonth = searchParams.endMonthHis || '0';
  const hasNextPage = total > Number(page) * 15;

  useEffect(() => {
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
    async function fetchHistory() {
      try {
        const response = await fetchData(
          role === 'SUPER_ADMIN'
            ? `report/products?page=${page}&pageSize=${pageSize}&startMonth=${startMonth}&endMonth=${endMonth}&product=${product}&warehouse=${warehouse}`
            : `report/products?page=${page}&pageSize=${pageSize}&startMonth=${startMonth}&endMonth=${endMonth}&product=${product}&warehouse=${warehouseName}`,
        );
        setHistory(response.monthlyHistory);
        setTotal(response.totalMutations);
      } catch (error) {
        console.log(error);
      }
    }
    role === 'WAREHOUSE_ADMIN'
      ? (fetchWarehouse(), warehouseName ? fetchHistory() : '')
      : fetchHistory();
  }, [
    page,
    pageSize,
    startMonth,
    endMonth,
    product,
    warehouse,
    adminWarehouseId,
    role,
    warehouseName,
  ]);
  return (
    <main>
      <div className="max-w-3xl w-full mx-auto mt-20 px-5 md:px-0 pb-20">
        <div className="flex items-center space-y-3 lg:space-y-0 flex-col lg:flex-row justify-between">
          <div className="text-3xl font-medium">Stock History</div>
          <ProductHistoryFilter
            endMonth={endMonth as string}
            product={product as string}
            role={role as string}
            startMonth={startMonth as string}
            warehouse={warehouse as string}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto shadow-md mt-10 w-full border border-slate-300 rounded-md">
            <thead className="text-left rounded-t-md border-b border-b-slate-300 text-slate-700">
              <tr>
                <th className="py-3 pl-8 rounded-tl-md">Product</th>
                <th className="py-3 px-1">Warehouse</th>
                <th className="py-3 px-1">Quantity</th>
                <th className="py-3 px-1">Mutation Type</th>
                <th className="py-3 px-1 rounded-tr-md">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((history, index) => {
                  return (
                    <tr key={index} className="border-b border-b-slate-200">
                      <td className="py-3 pl-8">{history.product?.name}</td>
                      {history.destinationWarehouse?.name ===
                      (role === 'SUPER_ADMIN' ? warehouse : warehouseName) ? (
                        <td className="py-3 px-1">
                          {history.destinationWarehouse?.name}
                        </td>
                      ) : (
                        <td className="py-3 px-1">{history.warehouse?.name}</td>
                      )}
                      {history.destinationWarehouse?.name ===
                      (role === 'SUPER_ADMIN' ? warehouse : warehouseName) ? (
                        <td className="py-3 px-1 text-red-600">
                          -{history.quantity}
                        </td>
                      ) : history.isAdd === true ? (
                        <td className="py-3 px-1 text-green-600">
                          +{history.quantity}
                        </td>
                      ) : (
                        <td className="py-3 px-1 text-red-600">
                          -{history.quantity}
                        </td>
                      )}
                      <td className="py-3 px-1">{history.mutationType}</td>
                      <td className="py-3 px-1">
                        {new Date(history.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 px-1 text-center">
                    There are no history to show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex">
          <div
            id="pagination"
            className="flex items-center mx-auto mt-10 border border-slate-300 rounded"
          >
            <Link
              href={
                role === 'SUPER_ADMIN'
                  ? `?pageHis=${
                      Number(page) - 1
                    }&pageSizeHis=${pageSize}&warehouseHis=${warehouse}&productHis=${product}&startMonthHis=${startMonth}&endMonthHis=${endMonth}`
                  : `?pageHis=${
                      Number(page) - 1
                    }&pageSizeHis=${pageSize}&productHis=${product}&startMonthHis=${startMonth}&endMonthHis=${endMonth}`
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
                  ? `?pageHis=${
                      Number(page) + 1
                    }&pageSizeHis=${pageSize}&warehouseHis=${warehouse}&productHis=${product}&startMonthHis=${startMonth}&endMonthHis=${endMonth}`
                  : `?pageHis=${
                      Number(page) + 1
                    }&pageSizeHis=${pageSize}&productHis=${product}&startMonthHis=${startMonth}&endMonthHis=${endMonth}`
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
