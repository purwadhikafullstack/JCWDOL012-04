'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { archiveData, fetchData } from '@/utils/api';
import { ProductCatBar } from '@/components/admin/ProductCatBar';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

export default function ProductCategories({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();
  const page = (searchParams.page || '1') as string;
  const pageSize = (searchParams.pageSize || '15') as string;
  const sort = (searchParams.sort || 'asc') as string;
  const hasNextPage = totalProducts - Number(page) * Number(pageSize) > 0;
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;

  const fetchProductCategories = useCallback(async () => {
    try {
      const response = await fetchData(
        `admin/product-categories?page=${page}&pageSize=${pageSize}&sort=${sort}`,
      );
      setProductCategories(response.productCategories);
      setTotalProducts(response.totalProductCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sort]);

  useEffect(() => {
    fetchProductCategories();
  }, [fetchProductCategories]);

  const handleArchive = async () => {
    try {
      await archiveData(`admin/product-categories/${selectedId}`);
      fetchProductCategories();
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
      <div className="flex flex-col space-y-5 ml-[20px] lg:space-y-0 lg:flex-row lg:items-end lg:mx-auto lg:justify-between lg:w-[740px] xl:w-[1000px] 2xl:w-[1120px]">
        <div className="text-3xl font-semibold">All Products Categories</div>
        <Link
          href={'/admin/product-categories/product-categories-form'}
          className={`${role === 'SUPER_ADMIN' ? '' : 'hidden'}`}
        >
          <div className="bg-[var(--primaryColor)] w-[200px] lg:w-auto text-white px-[17px] py-[10px] rounded-md font-semibold border cursor-pointer hover:bg-transparent hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] duration-200">
            + Add New Category
          </div>
        </Link>
      </div>
      <ProductCatBar
        page={page}
        pageSize={pageSize}
        sort={sort}
        hasNextPage={hasNextPage}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col mb-[200px] space-y-4 items-center mt-[20px]">
          {productCategories.map((procat, index) => {
            return (
              <Link
                href={`/admin/products?category=${procat.name}`}
                key={index}
              >
                <div
                  id="product-categories-container"
                  className="bg-gradient-to-r from-white to-purple-300 border h-[60px] flex items-center justify-between space-x-10 shadow-md w-[320px] md:w-[500px] lg:w-[750px] xl:w-[1000px] 2xl:w-[1120px] rounded-md px-[30px] hover:scale-105 duration-200"
                >
                  <div className="flex items-center">
                    <div className="font-semibold w-[140px] lg:w-[200px] truncate">
                      #{procat.name}
                    </div>
                    <div className="hidden md:flex text-gray-600 w-[150px] lg:w-[220px] xl:w-[400px] truncate">
                      {procat.description}
                    </div>
                  </div>
                  <div
                    id="update-delete"
                    className="flex items-center space-x-3 justify-between w-[245px]"
                  >
                    <div className=" hidden md:flex">
                      {procat.products?.length}
                    </div>
                    <div
                      className={`${
                        role === 'SUPER_ADMIN' ? '' : 'hidden'
                      } flex items-center space-x-3`}
                    >
                      <div
                        className="border border-white p-[7px] rounded-md hover:scale-125 duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/admin/product-categories/${procat.id}`);
                        }}
                      >
                        <div className="relative w-[15px] h-[15px]">
                          <Image
                            src={'/images/icon/pencil.png'}
                            fill
                            alt="edit"
                          />
                        </div>
                      </div>
                      <div
                        className="border border-white p-[7px] rounded-md hover:scale-125 duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalOpen(true);
                          setSelectedId(procat.id);
                        }}
                      >
                        <div className="relative w-[15px] h-[15px]">
                          <Image
                            src={'/images/icon/delete.png'}
                            fill
                            alt="edit"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <ConfirmModal
        handleArchive={handleArchive}
        isModalOpen={isModalOpen}
        item="product category"
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
