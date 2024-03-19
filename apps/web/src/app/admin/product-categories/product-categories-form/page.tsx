'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { Loading } from '@/components/Loading';
import * as Yup from 'yup';
import { createData } from '@/utils/api';
import { SuccessModal } from '@/components/admin/SuccessModal';

export default function ProductCategoriesForm() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await createData(
          'admin/product-categories',
          values,
          'application/json',
        );
        console.log(response);

        if (response.status === 201) {
          setIsModalOpen(true);
          const data = response.data;
          console.log('Product category created successfully:', data);
        } else {
          console.error(
            'Failed to create product category:',
            response.statusText,
          );
        }
      } catch (error: any) {
        console.error('Error creating product:', error);
        if (error.response && error.response.status === 400) {
          setError('Product category name is already taken');
        } else {
          setError('An error occurred while editing the product category');
        }
      }
    },
  });

  if (isAuthorLoading) return <Loading />;

  if (!isAuthenticated || role !== 'SUPER_ADMIN')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );

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
        <div className="mt-[30px]">
          <button
            type="submit"
            className="bg-[var(--primaryColor)] text-white px-4 py-2 rounded w-full"
          >
            Submit
          </button>
        </div>
      </form>
      <SuccessModal
        isModalOpen={isModalOpen}
        item="Product Category Created"
        path="/admin/product-categories"
        setIsModalOpen={setIsModalOpen}
        preventDefault={false}
      />
    </div>
  );
}
