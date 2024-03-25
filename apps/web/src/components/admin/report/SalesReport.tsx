'use client';

import { Card, AreaChart } from '@tremor/react';
import { fetchData } from '@/utils/api';
import { useEffect, useState } from 'react';
import { formatToRupiah } from '@/utils/helper';
import { WarehousesModel } from '@/model/WarehousesModel';
import Image from 'next/image';
import { SalesFilter } from './SalesFilter';

interface Total {
  price: number;
  quantity: number;
}

export default function SalesReport({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState<Total>();
  const warehouse = (searchParams.warehouse || '') as string;
  const productCategory = (searchParams.productCategory || '') as string;
  const product = (searchParams.product || '') as string;
  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetchData(
          `sales?warehouse=${warehouse}&productCategory=${productCategory}&product=${product}`,
        );
        console.log(response);
        setSales(response.monthlySales);
        setTotal(response.revenue);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSales();
  }, [product, productCategory, warehouse]);
  console.log(sales);
  return (
    <>
      <div className="max-w-3xl w-full mx-auto mt-10">
        <div className="flex flex-col space-y-3 px-3 lg:px-0 lg:space-y-0 lg:flex-row lg:items-center justify-between">
          <div className="text-3xl font-semibold text-start">Sales Report</div>
          <SalesFilter
            warehouse={warehouse}
            category={productCategory}
            product={product}
          />
        </div>
        <Card className="border rounded-md mt-10">
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
        <Card className="border rounded-md mt-10">
          <h3 className="text-tremor-title text-tremor-content dark:text-dark-tremor-content">
            Total Sales
          </h3>
          <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
            {total?.quantity} Items
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
