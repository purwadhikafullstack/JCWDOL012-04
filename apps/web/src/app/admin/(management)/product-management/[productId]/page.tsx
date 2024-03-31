'use client';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { archiveData, fetchData, updateData } from '@/utils/api';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { ProductsModel } from '@/model/ProductsModel';
import { Loading } from '@/components/Loading';
import * as Yup from 'yup';
import Image from 'next/image';
import { SuccessModal } from '@/components/admin/SuccessModal';
import { ProductWarehousesModel } from '@/model/ProductWarehousesModel';

export default function ProductDetails({
  params,
}: {
  params: { productId: string };
}) {
  const [product, setProduct] = useState<ProductsModel | null>(null);
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [warehouse, setWarehouse] = useState<WarehousesModel>();
  const [productWarehouse, setProductWarehouse] =
    useState<ProductWarehousesModel>();
  const [productCategories, setProductCategories] = useState<
    ProductCategoriesModel[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false);
  const [productImagesError, setProductImagesError] = useState<string>('');
  const auth = useAuth();
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
    async function fetchWarehouse() {
      try {
        const response = await fetchData(
          `admin/product-warehouses/${warehouseAdminId}`,
        );
        setWarehouse(response);
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchStock() {
      try {
        const response = await fetchData(
          `admin/warehouse-stock?productId=${product?.id}&warehouseId=${warehouseAdminId}`,
        );
        setProductWarehouse(response);
      } catch (error) {
        console.log(error);
      }
    }
    role === 'SUPER_ADMIN'
      ? fetchWarehouses()
      : (fetchWarehouses(), fetchStock(), fetchWarehouse());
  }, [role, warehouseAdminId, product?.id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      weight: product?.weight || 0,
      productCategoryId: product?.productCategoryId || 0,
      productImages: product?.productImages || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      weight: Yup.number().required('Required'),
      productCategoryId: Yup.number().required('Required'),
      productImages: Yup.array().min(1, 'At least one image is required'),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name || '');
        formData.append('description', values.description || '');
        formData.append('price', (values.price || 0).toString());
        formData.append('weight', (values.weight || 0).toString());
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

        const response = await updateData(
          `admin/products/${params.productId}`,
          formData,
          'multipart/form-data',
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
      formik.values.weight !== formik.initialValues.weight ||
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
    maxSize: 1024 * 1024,
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
  });

  const deleteProductImage = async (index: number) => {
    const currentImages = formik.values.productImages || [];
    const updatedImages = [...currentImages];

    if (updatedImages.length > index) {
      const deletedImage = updatedImages.splice(index, 1)[0];
      formik.setFieldValue('productImages', updatedImages);

      if (deletedImage && deletedImage.id) {
        try {
          await archiveData(`admin/product-images/${deletedImage.id}`);
          console.log('Image deleted successfully');
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }
  };
  if (isAuthorLoading) return <Loading />;
  if (!isAuthenticated || role === 'CUSTOMER')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );
  if (
    product === null ||
    warehouses.length === 0 ||
    productCategories.length === 0
  ) {
    return <Loading />;
  }
  return (
    <div className="w-full p-10 md:p-0 min-h-[1300px] lg:min-h-[800px] max-w-[1440px] mx-auto">
      <form
        onSubmit={formik.handleSubmit}
        className={`${
          role === 'SUPER_ADMIN' ? '' : 'pointer-events-none'
        } flex flex-col w-full`}
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
              <textarea
                rows={5}
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="w-full border px-3 py-2 rounded"
              ></textarea>
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
                htmlFor="weight"
                className="block font-semibold text-lg mb-1"
              >
                Weight(g)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.weight}
                className="w-full border px-3 py-2 rounded"
              />
              {formik.touched.weight && formik.errors.weight ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.weight}
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
                <div className="flex min-w-[280px] space-x-3 items-end my-3">
                  <div className="relative w-6 h-6">
                    <Image src={'/images/icon/home.png'} fill alt="house" />
                  </div>
                  <div className="">{warehouse?.name} :</div>
                  <div className="font-semibold">{productWarehouse?.stock}</div>
                </div>
              ) : (
                <div className="flex flex-wrap mt-2">
                  {warehouses.map((warehouse, index) => {
                    return (
                      <div
                        key={index}
                        className="flex min-w-[280px] space-x-3 items-end mr-3 my-2"
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
                    className="relative w-[60px] h-[60px] md:w-[90px] md:h-[90px] xl:w-[150px] xl:h-[150px] 2xl:w-[180px] 2xl:h-[180px] mx-[20px] my-[10px] shadow-md border rounded-md"
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
                    {formik.values.productImages.length > 1 && (
                      <button
                        type="button"
                        className={`${
                          role === 'SUPER_ADMIN' ? '' : 'hidden'
                        } absolute top-[-5px] right-[-8px] px-[8px] bg-red-500 text-white rounded-full`}
                        onClick={() => deleteProductImage(index)}
                      >
                        x
                      </button>
                    )}
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
                <p className="text-gray-500 text-justify">
                  Drag n drop some files here, or click to select files (.jpg,
                  .jpeg, .png, .gif) max size : 1MB
                </p>
              </div>
              <div className="text-red-500 text-sm mt-3">
                {productImagesError}
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
        <SuccessModal
          isModalOpen={isModalOpen}
          item="Product Edited"
          path="/admin/product-management"
          setIsModalOpen={setIsModalOpen}
          preventDefault={false}
        />
      </form>
    </div>
  );
}
