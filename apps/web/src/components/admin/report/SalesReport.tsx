'use client';

import { Card, AreaChart } from '@tremor/react';
import { useEffect, useState } from 'react';
import { fetchData } from '@/utils/api';
import { formatToRupiah } from '@/utils/helper';
import { SalesFilter } from './SalesFilter';
import { Loading } from '@/components/Loading';

interface Total {
  price: number;
  quantity: number;
}

export default function SalesReport({
  searchParams,
  role,
  adminWarehouseId,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  role: string | undefined;
  adminWarehouseId: number | undefined;
}) {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState<Total>();
  const [warehouseName, setWarehouseName] = useState<string>('');
  const warehouse = (searchParams.warehouse || '') as string;
  const productCategory = (searchParams.productCategory || '') as string;
  const product = (searchParams.product || '') as string;
  const startMonth = (searchParams.startMonth || '12') as string;
  const endMonth = (searchParams.endMonth || '0') as string;
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
    async function fetchSales() {
      try {
        const response = await fetchData(
          `report?warehouse=${
            role === 'WAREHOUSE_ADMIN' ? warehouseName : warehouse
          }&productCategory=${productCategory}&product=${product}&startMonth=${startMonth}&endMonth=${endMonth}`,
        );
        setSales(response.monthlySales);
        setTotal(response.revenue);
      } catch (error) {
        console.log(error);
      }
    }
    role === 'WAREHOUSE_ADMIN'
      ? (fetchWarehouse(), warehouseName ? fetchSales() : '')
      : fetchSales();
  }, [
    product,
    productCategory,
    warehouse,
    adminWarehouseId,
    role,
    warehouseName,
    startMonth,
    endMonth,
  ]);
  if (!adminWarehouseId)
    return (
      <div className="w-full h-10 flex flex-col justify-center items-center">
        <div className="text-xl font-medium">
          You haven&apos;t assigned into a warehouse yet
        </div>
      </div>
    );
  if (sales.length === 0) return <Loading />;
  return (
    <>
      <hr className="mt-1" />
      <div className="max-w-3xl w-full mx-auto mt-10">
        <div className="flex flex-col space-y-3 px-3 lg:px-0 lg:space-y-0 lg:flex-row lg:items-start justify-between">
          <div className="text-3xl font-medium text-start">Sales Report</div>
          <SalesFilter
            warehouse={warehouse}
            category={productCategory}
            product={product}
            role={role}
            adminWarehouseId={adminWarehouseId}
            startMonth={startMonth}
          />
        </div>
        <Card className="border rounded-md mt-10 shadow-md">
          <h3 className="text-tremor-title text-tremor-content dark:text-dark-tremor-content">
            Total Revenue
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            {formatToRupiah(total?.price!)}
          </p>
          <AreaChart
            className="mt-4 h-72"
            data={sales}
            index="month"
            yAxisWidth={110}
            categories={['price']}
            colors={['purple']}
            valueFormatter={formatToRupiah}
            startEndOnly={true}
          />
        </Card>
        <Card className="border rounded-md mt-10 shadow-md">
          <h3 className="text-tremor-title text-tremor-content dark:text-dark-tremor-content">
            Total Sales
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            {total?.quantity || 0} Items
          </p>
          <AreaChart
            className="mt-4 h-72"
            data={sales}
            index="month"
            categories={['quantity']}
            colors={['blue']}
            startEndOnly={true}
          />
        </Card>
      </div>
    </>
  );
}
