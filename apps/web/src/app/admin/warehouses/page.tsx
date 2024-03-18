'use client';
import { WarehousesModel } from '@/model/WarehousesModel';
import { fetchData } from '@/utils/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const response = await fetchData('admin/product-warehouses');
        setWarehouses(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWarehouses();
  }, []);
  return (
    <div className="flex flex-col w-full px-[40px] min-h-[700px] pt-[30px]">
      <div className="text-2xl font-semibold">Warehouses</div>
      <div className="flex flex-wrap items-center">
        {warehouses.map((warehouse, index) => {
          return (
            <Link key={index} href={`/admin/warehouses/${warehouse.id}`}>
              <div className="p-5 border">{warehouse.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
