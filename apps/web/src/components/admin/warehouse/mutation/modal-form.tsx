'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createData, fetchData } from '@/utils/api';
import { ProductsModel } from '@/model/ProductsModel';
import { WarehousesModel } from '@/model/WarehousesModel';
import { SuccessModal } from '../../SuccessModal';
import Image from 'next/image';

interface MutationModalProps {
  isModalOpen: boolean;
  warehouseId: number;
  fetchData: () => {};
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MutationFormModal: React.FC<MutationModalProps> = (props) => {
  const [products, setProducts] = useState<ProductsModel[]>([]);
  const [warehouses, setWarehouses] = useState<WarehousesModel[]>([]);
  const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
  const fetchProductsWarehouses = async () => {
    try {
      const response = await fetchData(
        `admin/mutation-form/${props.warehouseId}`,
      );
      setProducts(response.products);
      setWarehouses(response.warehouses);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProductsWarehouses();
  }, []);
  const formik = useFormik({
    initialValues: {
      productId: 0,
      warehouseId: props.warehouseId,
      destinationWarehouseId: 0,
      quantity: 0,
    },
    validationSchema: Yup.object({
      productId: Yup.number()
        .min(1, 'Please select a product')
        .required('Required'),
      warehouseId: Yup.number().required('Required'),
      destinationWarehouseId: Yup.number()
        .min(1, 'Please select a warehouse')
        .required('Required'),
      quantity: Yup.number()
        .min(1, 'Quantity must be greater than 0')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await createData(
          'admin/mutation',
          values,
          'application/json',
        );
        console.log(response);
        if (response.status === 201) {
          props.fetchData();
          setIsOpenModal(true);
          props.setIsModalOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div>
      <AnimatePresence>
        {props.isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: -300, x: -187 }}
              animate={{ opacity: 1, y: -250, x: -187 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.2 }}
              className="fixed flex flex-col items-center space-y-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[400px] rounded-md px-10 py-7 shadow-md z-50"
            >
              <div
                className="absolute font-semibold right-4 top-4 cursor-pointer"
                onClick={() => {
                  props.setIsModalOpen(false);
                }}
              >
                <div className="relative w-7 h-7">
                  <Image src={'/images/icon/close.png'} fill alt="close" />
                </div>
              </div>
              <div className="text-[var(--primaryColor)] font-semibold text-xl">
                Mutation Request Form
              </div>
              <form onSubmit={formik.handleSubmit} className="w-full">
                <div className="my-2">
                  <label htmlFor="productId">Product</label>
                  <select
                    id="productId"
                    name="productId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.productId}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option disabled value={0}>
                      Select a Product
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.productId && formik.errors.productId ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.productId}
                    </div>
                  ) : null}
                </div>
                <div className="my-2">
                  <label htmlFor="destinationWarehouseId">
                    Destination Warehouse
                  </label>
                  <select
                    id="destinationWarehouseId"
                    name="destinationWarehouseId"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.destinationWarehouseId}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option disabled value={0}>
                      Select a Warehouse
                    </option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.destinationWarehouseId &&
                  formik.errors.destinationWarehouseId ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.destinationWarehouseId}
                    </div>
                  ) : null}
                </div>
                <div className="my-2">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    id="quantity"
                    name="quantity"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.quantity}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {formik.touched.quantity && formik.errors.quantity ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.quantity}
                    </div>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="bg-[var(--primaryColor)] text-white rounded w-full py-2 mt-4"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SuccessModal
        isModalOpen={isModalOpen}
        item="Mutation Request Created"
        path=""
        preventDefault={true}
        setIsModalOpen={setIsOpenModal}
      />
    </div>
  );
};
