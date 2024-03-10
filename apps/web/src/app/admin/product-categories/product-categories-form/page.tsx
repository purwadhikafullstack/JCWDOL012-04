'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Yup from 'yup';
import axios from 'axios';

export default function ProductCategoriesForm() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
        const response = await axios.post(
          `${baseURL}/admin/product-categories`,
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
          console.log('Product category created successfully:', data);
        } else {
          console.error(
            'Failed to create product category:',
            response.statusText,
          );
        }
      } catch (error) {
        console.error('Error creating product:', error);
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
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="modal"
          >
            <div className="bg-black relative w-full left-0 top-6 h-screen opacity-50">
              <div className="bg-white">a</div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
