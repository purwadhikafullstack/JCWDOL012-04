'use client';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategoriesModel } from '@/model/ProductCategoriesModel';
import * as Yup from 'yup';
import axios from 'axios';
import { fetchData } from '@/utils/api';
import Link from 'next/link';

export default function ProductCategoriesUpdateForm({
  params,
}: {
  params: { productCatId: string };
}) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productCategory, setProductCategory] =
    useState<ProductCategoriesModel | null>(null);
  useEffect(() => {
    async function fetchProductCategory() {
      try {
        const response = await fetchData(
          `admin/product-categories/${params.productCatId}`,
        );
        setProductCategory(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProductCategory();
  }, [params.productCatId]);

  const formik = useFormik({
    initialValues: {
      name: productCategory?.name,
      description: productCategory?.description,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.patch(
          `${baseURL}/admin/product-categories/${productCategory?.id}`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 201) {
          setIsModalOpen(true);
          const data = response.data;
          console.log('Product category updated successfully:', data);
        } else {
          console.error(
            'Failed to edit product category:',
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Error editing product:', error);
      }
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 ">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto mt-8 p-10 bg-white rounded border shadow-md"
      >
        <div className="mb-6 text-center font-semibold text-2xl text-[var(--primaryColor)] py-2 rounded-md">
          Product Category Form
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
        <div className="mt-[30px]">
          <button
            type="submit"
            className="bg-[var(--primaryColor)] text-white px-4 py-2 rounded w-full"
          >
            Submit
          </button>
        </div>
      </form>
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
                Product Category edited Successfully
              </div>
              <Link href={'/admin/product-categories'}>
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
    </div>
  );
}