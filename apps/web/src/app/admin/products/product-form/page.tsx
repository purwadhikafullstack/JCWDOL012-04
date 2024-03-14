'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { createData, fetchData } from '@/utils/api';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { useFormik } from 'formik';
import { useAuth } from '@/lib/store/auth/auth.provider';
import * as Yup from 'yup';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Loading } from '@/components/Loading';

const CreateProductForm = () => {
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productImagesError, setProductImagesError] = useState<string>('');
  const auth = useAuth();
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      productCategoryId: '',
      productsWarehouses: warehouses.map((warehouse) => ({
        warehouseId: warehouse.id,
        stock: 0,
      })),
      productImages: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      productCategoryId: Yup.number().required('Required'),
      productsWarehouses: Yup.array().of(
        Yup.object({
          stock: Yup.number().required('Required'),
        }),
      ),
      productImages: Yup.array().min(1, 'At least one image is required'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('productCategoryId', values.productCategoryId);
        formData.append(
          'productsWarehouses',
          JSON.stringify(values.productsWarehouses),
        );
        values.productImages.forEach((image) => {
          formData.append('productImages', image);
        });
        console.log(values);
        const response = await createData(
          `admin/products`,
          formData,
          'multipart/form-data',
        );

        if (response.status === 201) {
          setIsModalOpen(true);
          const data = response.data;
          console.log('Product created successfully:', data);
        } else {
          console.error('Failed to create product:', response.statusText);
        }
      } catch (error: any) {
        console.error('Error creating product:', error);
        if (error.response && error.response.status === 400) {
          setError('Product name is already taken');
        } else {
          setError('An error occurred while creating the product');
        }
      }
    },
  });

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await fetchData('product-categories');
        const categoriesData = response;
        setProductCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    };
    fetchProductCategories();
  }, []);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetchData('admin/product-warehouses');
        const warehouseData = response;
        setWarehouses(warehouseData);
        formik.setFieldValue(
          'productsWarehouses',
          warehouseData.map((warehouse: WarehousesModel, index: number) => ({
            warehouseId: warehouse.id,
            stock: 0,
          })),
        );
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      if (formik.values.productImages.length + acceptedFiles.length > 4) {
        setProductImagesError('Product images reaches limit');
        return;
      }

      const invalidFiles = acceptedFiles.some((file) => {
        const extension = `.${file.name.split('.').pop()}`;
        return !['.png', '.gif', '.jpeg', '.jpg'].includes(
          extension.toLowerCase(),
        );
      });

      if (invalidFiles) {
        setProductImagesError('Invalid file(s) detected:');
        return;
      }

      formik.setFieldValue('productImages', [
        ...(formik.values.productImages || []),
        ...acceptedFiles,
      ]);
    },
    maxFiles: 4,
    maxSize: 1024 * 1024,
  });

  if (isAuthorLoading) return <Loading />;

  if (!isAuthenticated || role !== 'SUPER_ADMIN')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );

  if (productCategories.length === 0 || warehouses.length === 0) {
    return <Loading />;
  }

  return (
    <div className="w-full pt-[50px] pb-[200px] flex justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 ">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto mt-8 p-10 bg-white rounded-md border shadow-md"
      >
        <div className="mb-6 text-center font-semibold text-2xl text-[var(--primaryColor)] py-2 rounded-md">
          Product Form
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-600 mb-1"
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
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
          {error && (
            <div className="text-red-500 text-sm mb-[10px]">{error}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-600 mb-1"
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

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-600 mb-1"
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
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="productCategoryId"
            className="block text-sm font-semibold text-gray-600 mb-1"
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

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Product Warehouses
          </label>
          {formik.values.productsWarehouses.map((warehouse, index) => (
            <div key={index} className="mb-2">
              <label className="block text-sm text-gray-600">
                {warehouses[index].name}
              </label>
              <input
                type="number"
                name={`productsWarehouses[${index}].stock`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={warehouse.stock}
                className="w-full border px-3 py-2 rounded"
              />

              {formik.touched.productsWarehouses &&
              formik.errors.productsWarehouses &&
              formik.errors.productsWarehouses[index] &&
              //@ts-ignore
              formik.errors.productsWarehouses[index].stock ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.productsWarehouses[index].stock}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Product Images
          </label>
          <div
            {...getRootProps({
              className:
                'dropzone border-dashed border-2 p-4 rounded cursor-grab',
            })}
          >
            <input {...getInputProps()} />
            <p className="text-gray-500 text-justify">
              Drag n drop some files here, or click to select files (.jpg,
              .jpeg, .png, .gif) max size : 1MB
            </p>
          </div>
          {formik.touched.productImages && formik.errors.productImages ? (
            <div className="text-red-500 text-sm">
              {formik.errors.productImages}
            </div>
          ) : null}
        </div>
        <div className="text-red-500 text-sm mt-3">{productImagesError}</div>

        <div className="mt-4 flex space-x-4 mb-[20px]">
          {formik.values.productImages.map((image, index) => (
            <div key={index} className="relative w-16 h-16">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() =>
                  formik.setFieldValue(
                    'productImages',
                    formik.values.productImages.filter((_, i) => i !== index),
                  )
                }
                className="absolute top-[-5px] right-[-8px] px-[8px] bg-red-500 text-white rounded-full"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div>
          <button
            type="submit"
            className="bg-[var(--primaryColor)] border text-white px-4 py-2 w-full hover:text-[var(--primaryColor)] hover:bg-white border-[var(--primaryColor)] rounded duration-200"
          >
            Submit
          </button>
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
                  Product Created Successfully
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
};

export default CreateProductForm;
