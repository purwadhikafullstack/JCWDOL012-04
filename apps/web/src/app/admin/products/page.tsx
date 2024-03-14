'use client';

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { formatToRupiah } from '@/utils/helper';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { Loading } from '@/components/Loading';
import { NotFound } from '@/components/NotFound';
import { motion, AnimatePresence } from 'framer-motion';

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
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

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
      await axios.put(`${baseURL}/admin/products/${selectedId}`, {
        archived: true,
      });
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

  return (
    <div className="w-full flex flex-col bg-gray-200 pt-[20px]">
      <div className="flex flex-col space-y-5 ml-[20px] lg:space-y-0 lg:flex-row lg:items-end lg:mx-auto lg:justify-between lg:w-[740px] xl:w-[1120px]">
        <div className="text-3xl font-semibold">All Products</div>
        <Link
          href={'/admin/products/product-form'}
          className={`${role === 'SUPER_ADMN' ? '' : 'hidden'}`}
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
          className="flex flex-wrap justify-center mx-auto px-[10px] mb-[100px] mt-[10px]  xl:px-[100px] max-w-[1440px]"
        >
          {products.map((product, index) => {
            return (
              <Link key={index} href={`/admin/products/${product.id}`}>
                <div
                  id="product-container"
                  className="flex flex-col w-[290px] lg:w-[360px] h-[210px] bg-white m-[10px] p-[15px] rounded-md shadow-md hover:bg-slate-100"
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
                          src={'/images/products/product1image1.jpeg'}
                          className="object-cover object-center"
                          fill
                          alt="productImage"
                        />
                      </div>
                      <div
                        id="product-profile"
                        className="flex flex-col w-[110px] lg:w-[180px]"
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
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: -100, x: -187 }}
              animate={{ opacity: 1, y: -50, x: -187 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.2 }}
              className="fixed flex flex-col items-center space-y-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-[370px] h-[200px] shadow-md z-50"
            >
              <div className="flex font-semibold justify-center items-center bg-red-600 w-full text-white h-[45px] rounded-t-md">
                Warning
              </div>
              <div className="text-lg font-semibold text-center">
                Are you sure you want to delete this products?
              </div>
              <div className="flex items-center space-x-5">
                <button
                  className="bg-red-600 text-white px-5 py-[5px] border border-red-600 rounded-md hover:bg-white hover:text-red-600 duration-200"
                  onClick={() => {
                    handleArchive();
                    setIsModalOpen(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-[var(--primaryColor)] text-white px-5 py-[5px] border border-[var(--primaryColor)] rounded-md hover:bg-white hover:text-[var(--primaryColor)] duration-200"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  No
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
