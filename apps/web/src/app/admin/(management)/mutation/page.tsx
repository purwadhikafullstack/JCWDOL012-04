'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { createData, fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { SuccessModal } from '@/components/admin/SuccessModal';
import { Loading } from '@/components/Loading';
import Image from 'next/image';
import { Pagination } from '@/components/admin/warehouse/pagination';
import { WarehouseBar } from '@/components/admin/warehouse/WarehouseBar';
import Link from 'next/link';
import { WarehousesModel } from '@/model/WarehousesModel';

export default function WarehouseDetail({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [stock, setStock] = useState<number>(0);
  const [initialStock, setInitialStock] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isOpenWare, setIsOpenWare] = useState<boolean>(false);
  const auth = useAuth();
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;
  const warehouseId =
    role === 'WAREHOUSE_ADMIN'
      ? auth?.user.data?.wareHouseAdmin_warehouseId
      : searchParams.warehouseId || 1;
  const warehouseName = warehouses.filter((warehouse) => {
    return warehouse.id == warehouseId;
  });
  const page = (searchParams.page || '1') as string;
  const hasNextPage = totalProducts > Number(page) * 15;
  const isAdd = initialStock < stock ? true : false;
  const quantity = isAdd ? stock - initialStock : initialStock - stock;

  async function fetchProducts() {
    try {
      const response = await fetchData(
        `/admin/products?page=${page}&pageSize=15`,
      );
      setProducts(response.products);
      setTotalProducts(response.totalProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchWarehouses() {
    try {
      const response = await fetchData('admin/product-warehouses');
      setWarehouses(response);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, [page]);

  const handleUpdate = async () => {
    try {
      const updatedStock = await createData(
        `admin/product-warehouses/${warehouseId}`,
        {
          productId: selectedId,
          isAdd: isAdd,
          quantity: quantity,
          mutationType: 'MANUAL_ADMIN',
        },
        'application/json',
      );
      console.log(updatedStock);
      setIsModalOpen(true);
      fetchProducts();
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  if (isAuthorLoading && isLoading) return <Loading />;
  if (!isAuthenticated || role === 'CUSTOMER')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );

  return (
    <div className="flex flex-col w-full min-h-[700px] pt-10 pb-[120px] px-5 xl:px-20 2xl:px-32 max-w-[1440px] mx-auto">
      <div
        className={`${role === 'SUPER_ADMIN' ? 'mb-[10px]' : 'mb-[30px]'
          } flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0 lg:items-center`}
      >
        <div className="text-2xl font-semibold">{warehouseName[0]?.name}</div>
        <Link href={`/admin/mutation/${warehouseId}`}>
          <div className="bg-[var(--primaryColor)] px-4 py-2 text-white rounded-md hover:opacity-70 duration-200 w-48">
            Mutation Request <span className="font-semibold">-&gt;</span>
          </div>
        </Link>
      </div>
      <div
        className={`${role === 'SUPER_ADMIN' ? '' : 'hidden'
          } flex mb-5 justify-start lg:justify-end`}
      >
        <div className="relative">
          <div
            className="flex items-center space-x-2 border rounded-md px-[17px] py-1 cursor-pointer hover:bg-gray-200  border-slate-400"
            onClick={() => {
              setIsOpenWare(!isOpenWare);
            }}
          >
            <div>Select Warehouse</div>
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
          </div>
          <div
            className={`${isOpenWare ? '' : 'hidden'
              } z-10 left-[-10px] top-10 rounded-md bg-white absolute border shadow-md max-h-[300px] w-[210px] overflow-y-auto`}
          >
            {warehouses.map((warehouse, index) => {
              return (
                <Link
                  key={index}
                  href={`?warehouseId=${warehouse.id}`}
                  onClick={() => {
                    setIsOpenWare(false);
                  }}
                >
                  <div
                    className={`${warehouse.id === Number(warehouseId)
                      ? 'px-3 py-2 bg-[var(--primaryColor)] truncate text-white'
                      : 'px-3 py-2 hover:bg-slate-200 cursor-pointer truncate duration-150'
                      }`}
                  >
                    {warehouse.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <WarehouseBar />
      <div className="flex flex-col space-y-5">
        {products.map((product, index) => {
          const productStock = product.productsWarehouses?.find(
            (warehouse) => warehouse.warehouseId === Number(warehouseId),
          );
          return (
            <div
              key={index}
              className="flex shadow-md border h-[60px] items-center px-[20px] rounded-md justify-between"
            >
              <div className="flex items-center">
                <div className="relative w-[40px] h-[40px] mr-[30px] hidden md:flex">
                  <Image
                    src={'/images/products/product1image1.jpeg'}
                    fill
                    className="object-cover object-center"
                    alt="product image"
                  />
                </div>
                <div className="w-[100px] md:mr-[30px] md:w-[150px] xl:w-[200px] font-semibold truncate">
                  {product.name}
                </div>
                <div className="flex items-center md:space-x-2">
                  <div
                    className={`${edit && selectedId === product.id ? '' : 'hidden'
                      } ${stock < 1 ? 'pointer-events-none opacity-60' : ''
                      } bg-[var(--primaryColor)] px-[11px] py-[3px] text-white rounded-full hover:opacity-70 cursor-pointer`}
                    onClick={() => {
                      setStock(stock - 1);
                    }}
                  >
                    -
                  </div>
                  <div
                    className={`${edit && selectedId === product.id ? 'text-center' : ''
                      } w-10`}
                  >
                    {selectedId === product.id ? stock : productStock?.stock}
                  </div>
                  <div
                    className={`${edit && selectedId === product.id ? '' : 'hidden'
                      } bg-[var(--primaryColor)] px-[10px] py-[3px] text-white rounded-full cursor-pointer hover:opacity-70`}
                    onClick={() => {
                      setStock(stock + 1);
                    }}
                  >
                    +
                  </div>
                </div>
                <div className="border border-[var(--primaryColor)] ml-2 md:ml-5 p-1 rounded-md cursor-pointer hover:scale-110 duration-200">
                  <div
                    className="relative w-[20px] h-[20px]"
                    onClick={() => {
                      selectedId === product.id
                        ? setEdit(!edit)
                        : setEdit(true);
                      setSelectedId(product.id);
                      setStock(productStock!.stock);
                      setInitialStock(productStock!.stock);
                    }}
                  >
                    <Image
                      src={
                        edit && selectedId === product.id
                          ? '/images/icon/close.png'
                          : '/images/icon/pencil.png'
                      }
                      fill
                      alt="edit"
                    />
                  </div>
                </div>
                <div
                  className={`${edit &&
                    selectedId === product.id &&
                    productStock?.stock !== stock
                    ? ''
                    : 'hidden'
                    } ml-2 md:ml-5 bg-[var(--primaryColor)] text-white px-4 py-1 rounded-md hover:opacity-70 cursor-pointer`}
                  onClick={handleUpdate}
                >
                  Update
                </div>
              </div>
              <div className="items-center flex space-x-16 mr-5">
                <div className="font-semibold hidden xl:flex">
                  {new Date(productStock!.createdAt).toLocaleDateString()}
                </div>
                <div className="font-semibold hidden lg:flex">
                  {new Date(productStock!.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SuccessModal
        path={`/admin/warehouses/${warehouseId}?page=${page}&pageSize=15`}
        item="Product Stock Updated"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        preventDefault={true}
      />
      <Pagination page={page} hasNextPage={hasNextPage} />
    </div>
  );
}
