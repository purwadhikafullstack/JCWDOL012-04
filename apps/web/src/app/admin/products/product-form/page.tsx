'use client';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { createData, fetchData } from '@/utils/api';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { Loading } from '@/components/Loading';
import { SuccessModal } from '@/components/admin/SuccessModal';
import * as Yup from 'yup';
import Image from 'next/image';
import { FormInput } from '@/components/admin/product-form/FormInput';

export default function CreateProductForm() {
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
    fetchProductCategories();
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
        <FormInput
          htmlFor="name"
          label="Name"
          type="text"
          id="name"
          name="name"
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          values={formik.values.name}
          touched={formik.touched.name}
          errors={formik.errors.name}
        />
        {error && <div className="text-red-500 text-sm mb-[10px]">{error}</div>}
        <FormInput
          htmlFor="description"
          label="Description"
          type="text"
          id="description"
          name="description"
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          values={formik.values.description}
          touched={formik.touched.description}
          errors={formik.errors.description}
        />
        <FormInput
          htmlFor="price"
          label="Price"
          type="number"
          id="price"
          name="price"
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          values={formik.values.price}
          touched={formik.touched.price}
          errors={formik.errors.price}
        />
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
            {productCategories.map((category: any) => (
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
              {formik.errors.productsWarehouses &&
                formik.errors.productsWarehouses[index] &&
                //@ts-ignore
                formik.errors.productsWarehouses[index].stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {/* @ts-ignore */}
                    {formik.errors.productsWarehouses[index].stock}
                  </p>
                )}
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
        <SuccessModal
          isModalOpen={isModalOpen}
          item="Product Created"
          path="/admin/products"
          setIsModalOpen={setIsModalOpen}
        />
      </form>
    </div>
  );
}
