'use client';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchData } from '@/utils/api';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { ProductsModel } from '@/model/ProductsModel';
import { Loading } from '@/components/Loading';
import * as Yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function ProductDetails({
  params,
}: {
  params: { productId: string };
}) {
  const [product, setProduct] = useState<ProductsModel | null>(null);
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false);
  const auth = useAuth();
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;
  const warehouseAdminId = auth?.user?.data?.wareHouseAdmin_warehouseId;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetchData(`admin/products/${params.productId}`);
        setProduct(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [params.productId]);

  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const response = await fetchData(`product-categories`);
        setProductCategories(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProductCategories();
  }, []);

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      productCategoryId: product?.productCategoryId || 0,
      productImages: product?.productImages || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      productCategoryId: Yup.number().required('Required'),
      productImages: Yup.array().min(1, 'At least one image is required'),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name || '');
        formData.append('description', values.description || '');
        formData.append('price', (values.price || 0).toString());
        formData.append(
          'productCategoryId',
          (values.productCategoryId || 0).toString(),
        );
        formik.values.productImages?.forEach((image, index) => {
          if (typeof image === 'string') {
            formData.append(`productImages[${index}]`, image);
          } else if (image instanceof File) {
            formData.append(`productImages`, image);
          }
        });

        console.log('req body', values);
        const response = await axios.patch(
          `${baseURL}/admin/products/${params.productId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 200) {
          setIsModalOpen(true);
          const data = response.data;
          console.log('Product updated successfully:', data);
        } else {
          console.error('Failed to edit product:', response.statusText);
        }
      } catch (error: any) {
        console.error('Error editing product:', error);
        if (error.response && error.response.status === 400) {
          setError('Product name is already taken');
        } else {
          setError('An error occurred while editing the product');
        }
      }
    },
  });

  useEffect(() => {
    const formChanged =
      formik.values.name !== formik.initialValues.name ||
      formik.values.description !== formik.initialValues.description ||
      formik.values.price !== formik.initialValues.price ||
      formik.values.productCategoryId !==
        formik.initialValues.productCategoryId ||
      formik.values.productImages?.some(
        (image, index) => image !== formik.initialValues.productImages?.[index],
      );

    setHasFormChanged(formChanged || false);
  }, [formik.values, formik.initialValues]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      const invalidFiles = acceptedFiles.some((file) => {
        const extension = `.${file.name.split('.').pop()}`;
        return !['.png', '.gif', '.jpeg', '.jpg'].includes(
          extension.toLowerCase(),
        );
      });

      if (!invalidFiles) {
        formik.setFieldValue('productImages', [
          ...(formik.values.productImages || []),
          ...acceptedFiles,
        ]);
      } else {
        console.error('Invalid file(s) detected:', acceptedFiles);
      }
    },
    maxSize: 1024 * 1024,
  });

  const deleteProductImage = async (index: number) => {
    const currentImages = formik.values.productImages || [];
    const updatedImages = [...currentImages];

    if (updatedImages.length > index) {
      const deletedImage = updatedImages.splice(index, 1)[0];
      formik.setFieldValue('productImages', updatedImages);

      if (deletedImage && deletedImage.id) {
        try {
          await axios.put(`${baseURL}admin/product-images/${deletedImage.id}`);
          console.log('Image deleted successfully');
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }
  };

  if (!isAuthenticated || role === 'CUSTOMER')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );

  if (
    product === null ||
    isAuthorLoading ||
    warehouses.length === 0 ||
    productCategories.length === 0
  ) {
    return <Loading />;
  }

  return (
    <div className="w-full md:px-[20px] max-w-[1440px] mx-auto">
      <form
        onSubmit={formik.handleSubmit}
        className={`${
          role === 'SUPER_ADMIN' ? '' : 'pointer-events-none'
        } flex flex-col w-full p-10`}
      >
        <div className="flex flex-col lg:flex-row w-full">
          <div id="left" className="flex flex-col lg:w-3/5 md:px-5">
            <div className="my-2">
              <label
                htmlFor="name"
                className="block font-semibold text-lg mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder={formik.initialValues.name}
                className="w-full border px-3 py-2 rounded"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
              {error && (
                <div className="text-red-500 text-sm mb-[10px]">{error}</div>
              )}
            </div>
            <div className="my-2">
              <label
                htmlFor="description"
                className="block font-semibold text-lg mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="w-full border px-3 py-2 rounded"
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <div className="my-2">
              <label
                htmlFor="price"
                className="block font-semibold text-lg mb-1"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className="w-full border px-3 py-2 rounded"
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              ) : null}
            </div>
            <div className="my-2">
              <label
                htmlFor="productCategoryId"
                className="block font-semibold text-lg mb-1"
              >
                Product Category
              </label>
              <select
                id="productCategoryId"
                name="productCategoryId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.productCategoryId}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formik.touched.productCategoryId &&
              formik.errors.productCategoryId ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.productCategoryId}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col w-full my-2">
              <div className="font-semibold text-lg">
                Product Stocks{' '}
                <span className="text-slate-600 font-normal">(read only)</span>
              </div>
              {role === 'WAREHOUSE_ADMIN' ? (
                <div className="flex w-[220px] space-x-3 items-end my-3">
                  <div className="relative w-6 h-6">
                    <Image src={'/images/icon/home.png'} fill alt="house" />
                  </div>
                  <div className="">
                    {warehouses[warehouseAdminId! - 1].name} :
                  </div>
                  <div className="font-semibold">
                    {product.productsWarehouses?.[warehouseAdminId! - 1]
                      ?.stock ?? 0}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap mt-2">
                  {warehouses.map((warehouse, index) => {
                    return (
                      <div
                        key={index}
                        className="flex w-[220px] space-x-3 items-end mr-3 my-2 "
                      >
                        <div className="relative w-6 h-6">
                          <Image
                            src={'/images/icon/home.png'}
                            fill
                            alt="house"
                          />
                        </div>
                        <div className="">{warehouse.name} :</div>
                        <div className="font-semibold">
                          {product.productsWarehouses?.[index]?.stock ?? 0}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div id="right" className="flex flex-col lg:w-2/5 md:px-5">
            <div className="my-2">
              <label className="block font-semibold text-lg mb-1">
                Product Images
              </label>
              <div className="flex flex-wrap my-4">
                {formik.values.productImages?.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-[60px] h-[60px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] xl:w-[180px] xl:h-[180px] mx-[20px] my-[10px] shadow-md border rounded-md"
                  >
                    <Image
                      src={
                        image.path.startsWith('http')
                          ? image.path
                          : //@ts-ignore
                            URL.createObjectURL(image)
                      }
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                    <button
                      type="button"
                      className={`${
                        role === 'SUPER_ADMIN' ? '' : 'hidden'
                      } absolute top-[-5px] right-[-8px] px-[8px] bg-red-500 text-white rounded-full`}
                      onClick={() => deleteProductImage(index)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div
                className={`${
                  role === 'SUPER_ADMIN' ? '' : 'hidden'
                } dropzone border-dashed border-2 p-4 rounded cursor-grab`}
                {...getRootProps({})}
              >
                <input {...getInputProps()} />
                <p className="text-gray-500">
                  Drag n drop some files here, or click to select files
                </p>
              </div>
            </div>
            <button
              type="submit"
              className={`${
                hasFormChanged ? '' : 'pointer-events-none opacity-60'
              } ${
                role === 'SUPER_ADMIN' ? '' : 'hidden'
              } mt-3 bg-[var(--primaryColor)] border text-white px-4 py-2 w-full hover:text-[var(--primaryColor)] hover:bg-white border-[var(--primaryColor)] rounded duration-200`}
            >
              Update
            </button>
          </div>
        </div>
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
                className="fixed flex flex-col items-center space-y-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-[370px] h-[170px] shadow-md z-50"
              >
                <div className="flex font-semibold justify-center items-center bg-[var(--primaryColor)] w-full text-white h-[45px] rounded-t-md">
                  Success
                </div>
                <div className="text-lg font-semibold">
                  Product Edited Successfully
                </div>
                <Link href={'/admin/products'}>
                  <button
                    className="bg-[var(--primaryColor)] text-white px-5 py-2 border border-[var(--primaryColor)] rounded-md hover:bg-white hover:text-[var(--primaryColor)] duration-200"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Close
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
