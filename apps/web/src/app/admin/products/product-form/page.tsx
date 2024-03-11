'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { fetchData } from '@/utils/api';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { WarehousesModel } from '@/model/WarehousesModel';

const CreateProductForm = () => {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

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
        console.log(values.productsWarehouses[0].warehouseId);
        console.log(values.productsWarehouses[0].stock);
        console.log(values);
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('productCategoryId', values.productCategoryId);
        values.productsWarehouses.forEach((warehouse, index) => {
          formData.append(
            `productsWarehouses[${index}].warehouseId`,
            warehouse.warehouseId.toString(),
          );
          formData.append(
            `productsWarehouses[${index}].stock`,
            warehouse.stock.toString(),
          );
        });

        values.productImages.forEach((image) => {
          formData.append('productImages', image);
        });
        console.log(formData);
        const response = await axios.post(
          `${baseURL}/admin/products`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 201) {
          const data = response.data;
          console.log('Product created successfully:', data);
          router.push('/admin/products');
        } else {
          console.error('Failed to create product:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating product:', error);
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

  const allowedExtensions = ['.png', '.jpeg', '.jpg', '.gif'];

  const { getRootProps, getInputProps } = useDropzone({
    // @ts-ignore
    accept: allowedExtensions.map((ext) => `.${ext}`).join(','),
    onDrop: (acceptedFiles) => {
      const invalidFiles = acceptedFiles.filter(
        (file) => !allowedExtensions.includes(`.${file.name.split('.').pop()}`),
      );

      if (invalidFiles.length > 0) {
        console.error('Invalid file(s) detected:', invalidFiles);
      } else {
        formik.setFieldValue('productImages', acceptedFiles);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto mt-8 p-10 bg-white rounded border shadow-md"
    >
      <div className="mb-6 text-center font-semibold text-2xl text-white bg-[var(--primaryColor)] py-2 rounded-md">
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
        {formik.touched.productCategoryId && formik.errors.productCategoryId ? (
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
          <p className="text-gray-500">
            Drag n drop some files here, or click to select files
          </p>
        </div>
        {formik.touched.productImages && formik.errors.productImages ? (
          <div className="text-red-500 text-sm">
            {formik.errors.productImages}
          </div>
        ) : null}
      </div>

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
          className="bg-[var(--primaryColor)] text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;
