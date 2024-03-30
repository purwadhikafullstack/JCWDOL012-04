'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { archiveData, fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { formatToRupiah } from '@/utils/helper';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { Loading } from '@/components/Loading';
import { NotFound } from '@/components/NotFound';
import Link from 'next/link';
import Image from 'next/image';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

export default function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const auth = useAuth();
  const page = (searchParams.page || '1') as string;
  const pageSize = (searchParams.pageSize || '15') as string;
  const search = (searchParams.search || '') as string;
  const category = (searchParams.category || '') as string;
  const sort = (searchParams.sort || '') as string;
  const hasNextPage = totalProducts - Number(page) * Number(pageSize) > 0;

  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetchData(
        `products?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`,
      );
      setProducts(response.products);
      setTotalProducts(response.totalProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sort, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleArchive = async () => {
    try {
      await archiveData(`admin/products/${selectedId}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuthorLoading) return <Loading />;

  if (!isAuthenticated || role === 'CUSTOMER')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );

  console.log(totalProducts);

  return (
    <div className="w-full flex flex-col bg-gray-200 pt-[20px] pb-40">
      <div className="flex flex-col space-y-5 ml-[20px] md:space-y-0 md:flex-row md:items-end md:mx-auto md:justify-between md:w-[500px] lg:w-[660px] xl:w-[1000px] 2xl:w-[1120px]">
        <div className="text-3xl font-semibold">All Products</div>
        <Link
          href={'/admin/product-management/product-form'}
          className={`${role === 'SUPER_ADMIN' ? '' : 'hidden'}`}
        >
          <div className="bg-[var(--primaryColor)] w-[200px] lg:w-auto text-white px-[17px] py-[10px] rounded-md font-semibold border cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] duration-200">
            + Add New Product
          </div>
        </Link>
      </div>
      <AdminSearchBar
        category={category}
        sort={sort}
        page={page}
        pageSize={pageSize}
        totalProducts={totalProducts}
      />
      {isLoading ? (
        <Loading />
      ) : products.length === 0 ? (
        <NotFound />
      ) : (
        <div
          id="product-list-container"
          className="flex flex-wrap justify-center mx-auto px-[10px] mb-[40px] mt-[10px]  2xl:px-[100px] max-w-[1440px]"
        >
          {products.map((product, index) => {
            return (
              <Link
                key={index}
                href={`/admin/product-management/${product.id}`}
              >
                <div
                  id="product-container"
                  className="flex flex-col w-[290px] lg:w-[320px] 2xl:w-[360px] h-[210px] bg-white m-[10px] p-[15px] rounded-md shadow-md hover:bg-slate-100"
                >
                  <div
                    id="product-top"
                    className="flex h-[100px] items-start justify-between"
                  >
                    <div className="flex items-center space-x-5">
                      <div
                        id="product-image"
                        className="relative w-[90px] h-[90px]"
                      >
                        <Image
                          src={
                            product.productImages?.[0]?.path.startsWith('http')
                              ? product.productImages?.[0]?.path!
                              : '/images/products/product1image1.jpeg'
                          }
                          className="object-cover object-center"
                          fill
                          alt="productImage"
                        />
                      </div>
                      <div
                        id="product-profile"
                        className="flex flex-col w-[110px] xl:w-[150px] 2xl:w-[180px]"
                      >
                        <div className="font-semibold text-lg truncate">
                          {product.name}
                        </div>
                        <div className="text-gray-600 truncate">
                          {product.productCategory.name}
                        </div>
                        <div className="mt-[10px] font-bold">
                          {formatToRupiah(product.price)}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        role === 'SUPER_ADMIN' ? '' : 'hidden'
                      } border border-red-600 p-[5px] rounded-md hover:scale-110 duration-200`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModalOpen(true);
                        setSelectedId(product.id);
                      }}
                    >
                      <div className="relative w-[20px] h-[20px]">
                        <Image
                          src={'/images/icon/delete.png'}
                          fill
                          alt="edit"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    id="product-desc"
                    className="flex flex-col mt-[10px] justify-between h-[160px]"
                  >
                    <div>
                      <div className="font-semibold">Description</div>
                      <div className="truncate">{product.description}</div>
                    </div>
                    <div
                      id="product-stock"
                      className="flex items-center justify-between font-semibold"
                    >
                      <div>Remaining Stock : </div>
                      <div>{product.totalStock}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div className="flex justify-center md:hidden">
        <div
          id="pagination"
          className="flex items-center border border-slate-300 rounded"
        >
          <Link
            href={`?page=${
              Number(page) - 1
            }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
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
          <div className="bg-slate-200 border-r border-l w-[30px] text-center pointer-events-none">
            {page}
          </div>
          <Link
            href={`?page=${
              Number(page) + 1
            }&pageSize=${pageSize}&search=${search}&category=${category}&sort=${sort}`}
            className={`${hasNextPage ? '' : 'opacity-50 pointer-events-none'}`}
          >
            <div className="px-[8px] cursor-pointer hover:opacity-70">
              <div className="relative w-[15px] h-[15px]">
                <Image src={'/images/icon/right-arrow.png'} fill alt="left" />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <ConfirmModal
        item="product"
        handleArchive={handleArchive}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
